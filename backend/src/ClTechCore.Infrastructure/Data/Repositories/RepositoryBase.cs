using ClTechCore.Domain.Entities;

namespace ClTechCore.Infrastructure.Data.Repositories;

/// <summary>
/// Interface genérica do Repository Pattern
/// </summary>
public interface IRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(Guid id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<IEnumerable<T>> GetPagedAsync(int page, int pageSize);
    Task<T> AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(Guid id);
    Task<int> SaveChangesAsync();
    IQueryable<T> GetQueryable();
}

/// <summary>
/// Repository genérico
/// </summary>
public class Repository<T> : IRepository<T> where T : BaseEntity
{
    private readonly ApplicationDbContext _context;

    public Repository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<T?> GetByIdAsync(Guid id)
    {
        return await _context.Set<T>().FindAsync(id);
    }

    public async Task<IEnumerable<T>> GetAllAsync()
    {
        return await Task.FromResult(_context.Set<T>().ToList());
    }

    public async Task<IEnumerable<T>> GetPagedAsync(int page, int pageSize)
    {
        return await Task.FromResult(
            _context.Set<T>()
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList()
        );
    }

    public async Task<T> AddAsync(T entity)
    {
        entity.CreatedAt = DateTime.UtcNow;
        await _context.Set<T>().AddAsync(entity);
        return entity;
    }

    public async Task UpdateAsync(T entity)
    {
        entity.UpdatedAt = DateTime.UtcNow;
        _context.Set<T>().Update(entity);
        await Task.CompletedTask;
    }

    public async Task DeleteAsync(Guid id)
    {
        var entity = await GetByIdAsync(id);
        if (entity != null)
        {
            entity.IsDeleted = true;
            entity.DeletedAt = DateTime.UtcNow;
            _context.Set<T>().Update(entity);
        }
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public IQueryable<T> GetQueryable()
    {
        return _context.Set<T>();
    }
}

/// <summary>
/// Repositório especializando para User
/// </summary>
public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByIdWithRolesAsync(Guid id);
}

public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(ApplicationDbContext context) : base(context) { }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return GetQueryable().FirstOrDefault(u => u.Email == email);
    }

    public async Task<User?> GetByIdWithRolesAsync(Guid id)
    {
        return GetQueryable()
            .Where(u => u.Id == id)
            .FirstOrDefault();
    }
}

/// <summary>
/// Repositório especializado para Bot
/// </summary>
public interface IBotRepository : IRepository<Bot>
{
    Task<IEnumerable<Bot>> GetByTenantIdAsync(Guid tenantId);
    Task<Bot?> GetByPhoneNumberAsync(string phoneNumber);
}

public class BotRepository : Repository<Bot>, IBotRepository
{
    public BotRepository(ApplicationDbContext context) : base(context) { }

    public async Task<IEnumerable<Bot>> GetByTenantIdAsync(Guid tenantId)
    {
        return GetQueryable().Where(b => b.TenantId == tenantId).ToList();
    }

    public async Task<Bot?> GetByPhoneNumberAsync(string phoneNumber)
    {
        return GetQueryable().FirstOrDefault(b => b.PhoneNumber == phoneNumber);
    }
}

/// <summary>
/// Repositório especializado para Message
/// </summary>
public interface IMessageRepository : IRepository<Message>
{
    Task<IEnumerable<Message>> GetByBotIdAsync(Guid botId, int page = 1, int pageSize = 50);
    Task<Message?> GetLastMessageAsync(Guid botId, string phoneNumber);
}

public class MessageRepository : Repository<Message>, IMessageRepository
{
    public MessageRepository(ApplicationDbContext context) : base(context) { }

    public async Task<IEnumerable<Message>> GetByBotIdAsync(Guid botId, int page = 1, int pageSize = 50)
    {
        return GetQueryable()
            .Where(m => m.BotId == botId)
            .OrderByDescending(m => m.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();
    }

    public async Task<Message?> GetLastMessageAsync(Guid botId, string phoneNumber)
    {
        return GetQueryable()
            .Where(m => m.BotId == botId && m.FromNumber == phoneNumber)
            .OrderByDescending(m => m.CreatedAt)
            .FirstOrDefault();
    }
}

/// <summary>
/// Repositório especializado para Tenant
/// </summary>
public interface ITenantRepository : IRepository<Tenant>
{
    Task<Tenant?> GetBySlugAsync(string slug);
}

public class TenantRepository : Repository<Tenant>, ITenantRepository
{
    public TenantRepository(ApplicationDbContext context) : base(context) { }

    public async Task<Tenant?> GetBySlugAsync(string slug)
    {
        return GetQueryable().FirstOrDefault(t => t.Slug == slug);
    }
}

/// <summary>
/// Repositório especializado para Session
/// </summary>
public interface ISessionRepository : IRepository<Session>
{
    Task<Session?> GetByTokenAsync(string token);
    Task<IEnumerable<Session>> GetUserSessionsAsync(Guid userId);
}

public class SessionRepository : Repository<Session>, ISessionRepository
{
    public SessionRepository(ApplicationDbContext context) : base(context) { }

    public async Task<Session?> GetByTokenAsync(string token)
    {
        return GetQueryable().FirstOrDefault(s => s.Token == token);
    }

    public async Task<IEnumerable<Session>> GetUserSessionsAsync(Guid userId)
    {
        return GetQueryable()
            .Where(s => s.UserId == userId && !s.IsRevoked)
            .OrderByDescending(s => s.CreatedAt)
            .ToList();
    }
}
