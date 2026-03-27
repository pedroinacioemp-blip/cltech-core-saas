using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ClTechCore.Application.DTOs;
using ClTechCore.Application.Services;

namespace ClTechCore.Api.Controllers;

/// <summary>
/// Controller de Autenticação
/// Endpoints públicos para login e registro
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    /// <summary>
    /// Registrar novo usuário
    /// </summary>
    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponseDto<AuthResponseDto>>> Register([FromBody] UserRegisterDto dto)
    {
        try
        {
            var result = await _authService.RegisterAsync(dto);
            return Ok(new ApiResponseDto<AuthResponseDto>
            {
                Success = true,
                Message = "Usuário registrado com sucesso",
                Data = result
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ApiResponseDto<AuthResponseDto>
            {
                Success = false,
                Message = ex.Message
            });
        }
    }

    /// <summary>
    /// Login de usuário
    /// </summary>
    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponseDto<AuthResponseDto>>> Login([FromBody] UserLoginDto dto)
    {
        try
        {
            var result = await _authService.LoginAsync(dto);
            return Ok(new ApiResponseDto<AuthResponseDto>
            {
                Success = true,
                Message = "Login realizado com sucesso",
                Data = result
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new ApiResponseDto<AuthResponseDto>
            {
                Success = false,
                Message = ex.Message
            });
        }
    }

    /// <summary>
    /// Renovar token de acesso
    /// </summary>
    [HttpPost("refresh")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponseDto<AuthResponseDto>>> RefreshToken([FromBody] RefreshTokenDto dto)
    {
        try
        {
            var result = await _authService.RefreshTokenAsync(dto.RefreshToken);
            return Ok(new ApiResponseDto<AuthResponseDto>
            {
                Success = true,
                Message = "Token renovado com sucesso",
                Data = result
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new ApiResponseDto<AuthResponseDto>
            {
                Success = false,
                Message = ex.Message
            });
        }
    }

    /// <summary>
    /// Health check
    /// </summary>
    [HttpGet("health")]
    public ActionResult<object> Health()
    {
        return Ok(new { status = "healthy", timestamp = DateTime.UtcNow });
    }
}

/// <summary>
/// Controller de Bot WhatsApp
/// Endpoints autenticados para gerenciar bots
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
[Produces("application/json")]
public class BotsController : ControllerBase
{
    private readonly IBotService _botService;
    private readonly ILogger<BotsController> _logger;

    public BotsController(IBotService botService, ILogger<BotsController> logger)
    {
        _botService = botService;
        _logger = logger;
    }

    /// <summary>
    /// Criar novo bot
    /// </summary>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponseDto<BotDto>>> CreateBot([FromBody] CreateBotDto dto)
    {
        try
        {
            var tenantId = Guid.Parse(User.Claims.FirstOrDefault(c => c.Type == "tenant")?.Value ?? "");
            var result = await _botService.CreateBotAsync(tenantId, dto);

            return CreatedAtAction(nameof(GetBot), new { id = result.Id }, new ApiResponseDto<BotDto>
            {
                Success = true,
                Message = "Bot criado com sucesso",
                Data = result
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ApiResponseDto<BotDto>
            {
                Success = false,
                Message = ex.Message
            });
        }
    }

    /// <summary>
    /// Obter bot por ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponseDto<BotDto>>> GetBot(Guid id)
    {
        try
        {
            var result = await _botService.GetBotAsync(id);
            return Ok(new ApiResponseDto<BotDto>
            {
                Success = true,
                Data = result
            });
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new ApiResponseDto<BotDto>
            {
                Success = false,
                Message = ex.Message
            });
        }
    }

    /// <summary>
    /// Listar bots do tenant
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponseDto<IEnumerable<BotDto>>>> GetBots()
    {
        var tenantId = Guid.Parse(User.Claims.FirstOrDefault(c => c.Type == "tenant")?.Value ?? "");
        var result = await _botService.GetTenantBotsAsync(tenantId);

        return Ok(new ApiResponseDto<IEnumerable<BotDto>>
        {
            Success = true,
            Data = result
        });
    }

    /// <summary>
    /// Atualizar bot
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponseDto<BotDto>>> UpdateBot(Guid id, [FromBody] UpdateBotDto dto)
    {
        try
        {
            var result = await _botService.UpdateBotAsync(id, dto);
            return Ok(new ApiResponseDto<BotDto>
            {
                Success = true,
                Message = "Bot atualizado com sucesso",
                Data = result
            });
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new ApiResponseDto<BotDto>
            {
                Success = false,
                Message = ex.Message
            });
        }
    }

    /// <summary>
    /// Deletar bot
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteBot(Guid id)
    {
        try
        {
            await _botService.DeleteBotAsync(id);
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new ApiResponseDto<object>
            {
                Success = false,
                Message = ex.Message
            });
        }
    }
}

/// <summary>
/// Controller de Mensagens
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
[Produces("application/json")]
public class MessagesController : ControllerBase
{
    private readonly ILogger<MessagesController> _logger;

    public MessagesController(ILogger<MessagesController> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Enviar mensagem
    /// </summary>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status202Accepted)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponseDto<object>>> SendMessage([FromBody] SendMessageDto dto)
    {
        // Implementação da fila de envio de mensagens
        // TODO: Integrar com Hangfire para processamento assíncrono

        return Accepted(new ApiResponseDto<object>
        {
            Success = true,
            Message = "Mensagem enfileirada para envio"
        });
    }

    /// <summary>
    /// Obter histórico de mensagens
    /// </summary>
    [HttpGet("bot/{botId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponseDto<PaginatedResponseDto<MessageDto>>>> GetBotMessages(
        Guid botId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50)
    {
        // TODO: Implementar paginação real

        return Ok(new ApiResponseDto<PaginatedResponseDto<MessageDto>>
        {
            Success = true,
            Data = new PaginatedResponseDto<MessageDto>
            {
                Page = page,
                PageSize = pageSize,
                Items = new List<MessageDto>()
            }
        });
    }
}
