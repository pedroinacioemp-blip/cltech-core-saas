using System.Security.Cryptography;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using ClTechCore.Domain.Entities;
using ClTechCore.Application.DTOs;
using ClTechCore.Infrastructure.Data.Repositories;

namespace ClTechCore.Application.Services;

/// <summary>
/// Serviço de Autenticação e Autorização
/// </summary>
public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(UserRegisterDto dto);
    Task<AuthResponseDto> LoginAsync(UserLoginDto dto);
    Task<AuthResponseDto> RefreshTokenAsync(string refreshToken);
    string GenerateJwtToken(User user);
    string GenerateRefreshToken();
    bool ValidatePassword(string password, string hash);
    string HashPassword(string password);
}

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly ITenantRepository _tenantRepository;
    private readonly ISessionRepository _sessionRepository;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        IUserRepository userRepository,
        ITenantRepository tenantRepository,
        ISessionRepository sessionRepository,
        IConfiguration configuration,
        ILogger<AuthService> logger)
    {
        _userRepository = userRepository;
        _tenantRepository = tenantRepository;
        _sessionRepository = sessionRepository;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<AuthResponseDto> RegisterAsync(UserRegisterDto dto)
    {
        // Verificar se usuário já existe
        var existingUser = await _userRepository.GetByEmailAsync(dto.Email);
        if (existingUser != null)
            throw new InvalidOperationException("Email já cadastrado");

        // Criar novo Tenant
        var tenant = new Tenant
        {
            Id = Guid.NewGuid(),
            Name = dto.Email.Split('@')[0],
            Slug = dto.Email.Split('@')[0].ToLower(),
            Plan = "free",
            MessageQuota = 100,
            BotLimit = 1,
            UserLimit = 1
        };

        await _tenantRepository.AddAsync(tenant);
        await _tenantRepository.SaveChangesAsync();

        // Criar novo usuário
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = dto.Email,
            FullName = dto.FullName,
            PhoneNumber = dto.PhoneNumber,
            PasswordHash = HashPassword(dto.Password),
            TenantId = tenant.Id,
            IsActive = true
        };

        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();

        // Gerar tokens
        var accessToken = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();

        // Salvar sessão
        var session = new Session
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddHours(1),
            RefreshExpiresAt = DateTime.UtcNow.AddDays(7)
        };

        await _sessionRepository.AddAsync(session);
        await _sessionRepository.SaveChangesAsync();

        _logger.LogInformation($"Novo usuário registrado: {user.Email}");

        return new AuthResponseDto
        {
            User = MapUserToDto(user),
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = session.ExpiresAt
        };
    }

    public async Task<AuthResponseDto> LoginAsync(UserLoginDto dto)
    {
        var user = await _userRepository.GetByEmailAsync(dto.Email);
        if (user == null || !ValidatePassword(dto.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Email ou senha inválidos");

        if (!user.IsActive)
            throw new UnauthorizedAccessException("Usuário desativado");

        user.LastLoginAt = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);

        var accessToken = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();

        var session = new Session
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddHours(1),
            RefreshExpiresAt = DateTime.UtcNow.AddDays(7)
        };

        await _sessionRepository.AddAsync(session);
        await _sessionRepository.SaveChangesAsync();

        _logger.LogInformation($"Usuário fez login: {user.Email}");

        return new AuthResponseDto
        {
            User = MapUserToDto(user),
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = session.ExpiresAt
        };
    }

    public async Task<AuthResponseDto> RefreshTokenAsync(string refreshToken)
    {
        var session = _sessionRepository.GetQueryable()
            .FirstOrDefault(s => s.RefreshToken == refreshToken && !s.IsRevoked);

        if (session == null || session.RefreshExpiresAt < DateTime.UtcNow)
            throw new UnauthorizedAccessException("Refresh token inválido ou expirado");

        var user = await _userRepository.GetByIdAsync(session.UserId);
        if (user == null)
            throw new InvalidOperationException("Usuário não encontrado");

        var newAccessToken = GenerateJwtToken(user);
        var newRefreshToken = GenerateRefreshToken();

        session.Token = newAccessToken;
        session.RefreshToken = newRefreshToken;
        session.ExpiresAt = DateTime.UtcNow.AddHours(1);
        session.RefreshExpiresAt = DateTime.UtcNow.AddDays(7);

        await _sessionRepository.UpdateAsync(session);
        await _sessionRepository.SaveChangesAsync();

        return new AuthResponseDto
        {
            User = MapUserToDto(user),
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken,
            ExpiresAt = session.ExpiresAt
        };
    }

    public string GenerateJwtToken(User user)
    {
        var key = new SymmetricSecurityKey(
            Encoding.ASCII.GetBytes(
                _configuration["Jwt:SecretKey"] ?? throw new InvalidOperationException()
            )
        );

        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new System.Security.Claims.ClaimsIdentity(new[]
            {
                new System.Security.Claims.Claim("sub", user.Id.ToString()),
                new System.Security.Claims.Claim("email", user.Email),
                new System.Security.Claims.Claim("tenant", user.TenantId.ToString())
            }),
            Expires = DateTime.UtcNow.AddHours(1),
            SigningCredentials = credentials,
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"]
        };

        var handler = new JwtSecurityTokenHandler();
        var token = handler.CreateToken(tokenDescriptor);
        return handler.WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        var randomNumber = new byte[32];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }

    public bool ValidatePassword(string password, string hash)
    {
        if (string.IsNullOrEmpty(password) || string.IsNullOrEmpty(hash))
            return false;

        return BCrypt.Net.BCrypt.Verify(password, hash);
    }

    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    private static UserDto MapUserToDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            IsActive = user.IsActive,
            LastLoginAt = user.LastLoginAt,
            PhoneNumber = user.PhoneNumber,
            TenantId = user.TenantId,
            CreatedAt = user.CreatedAt
        };
    }
}

/// <summary>
/// Serviço de Bot WhatsApp
/// </summary>
public interface IBotService
{
    Task<BotDto> CreateBotAsync(Guid tenantId, CreateBotDto dto);
    Task<BotDto> GetBotAsync(Guid botId);
    Task<IEnumerable<BotDto>> GetTenantBotsAsync(Guid tenantId);
    Task<BotDto> UpdateBotAsync(Guid botId, UpdateBotDto dto);
    Task DeleteBotAsync(Guid botId);
}

public class BotService : IBotService
{
    private readonly IBotRepository _botRepository;
    private readonly ITenantRepository _tenantRepository;
    private readonly ILogger<BotService> _logger;

    public BotService(
        IBotRepository botRepository,
        ITenantRepository tenantRepository,
        ILogger<BotService> logger)
    {
        _botRepository = botRepository;
        _tenantRepository = tenantRepository;
        _logger = logger;
    }

    public async Task<BotDto> CreateBotAsync(Guid tenantId, CreateBotDto dto)
    {
        var tenant = await _tenantRepository.GetByIdAsync(tenantId);
        if (tenant == null)
            throw new InvalidOperationException("Tenant não encontrado");

        var botCount = (await _botRepository.GetByTenantIdAsync(tenantId)).Count();
        if (botCount >= tenant.BotLimit)
            throw new InvalidOperationException($"Limite de bots atingido ({tenant.BotLimit})");

        var bot = new Bot
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            PhoneNumber = dto.PhoneNumber,
            TenantId = tenantId,
            EnableAI = dto.EnableAI,
            AIPrompt = dto.AIPrompt,
            Status = "inactive"
        };

        await _botRepository.AddAsync(bot);
        await _botRepository.SaveChangesAsync();

        _logger.LogInformation($"Bot criado: {bot.Id} para Tenant: {tenantId}");

        return MapBotToDto(bot);
    }

    public async Task<BotDto> GetBotAsync(Guid botId)
    {
        var bot = await _botRepository.GetByIdAsync(botId);
        if (bot == null)
            throw new InvalidOperationException("Bot não encontrado");

        return MapBotToDto(bot);
    }

    public async Task<IEnumerable<BotDto>> GetTenantBotsAsync(Guid tenantId)
    {
        var bots = await _botRepository.GetByTenantIdAsync(tenantId);
        return bots.Select(MapBotToDto).ToList();
    }

    public async Task<BotDto> UpdateBotAsync(Guid botId, UpdateBotDto dto)
    {
        var bot = await _botRepository.GetByIdAsync(botId);
        if (bot == null)
            throw new InvalidOperationException("Bot não encontrado");

        if (!string.IsNullOrEmpty(dto.Name))
            bot.Name = dto.Name;

        if (!string.IsNullOrEmpty(dto.Status))
            bot.Status = dto.Status;

        if (dto.EnableAI.HasValue)
            bot.EnableAI = dto.EnableAI.Value;

        if (!string.IsNullOrEmpty(dto.AIPrompt))
            bot.AIPrompt = dto.AIPrompt;

        await _botRepository.UpdateAsync(bot);
        await _botRepository.SaveChangesAsync();

        return MapBotToDto(bot);
    }

    public async Task DeleteBotAsync(Guid botId)
    {
        await _botRepository.DeleteAsync(botId);
        await _botRepository.SaveChangesAsync();
    }

    private static BotDto MapBotToDto(Bot bot)
    {
        return new BotDto
        {
            Id = bot.Id,
            Name = bot.Name,
            PhoneNumber = bot.PhoneNumber,
            Status = bot.Status,
            EnableAI = bot.EnableAI,
            AIPrompt = bot.AIPrompt,
            TenantId = bot.TenantId,
            CreatedAt = bot.CreatedAt
        };
    }
}
