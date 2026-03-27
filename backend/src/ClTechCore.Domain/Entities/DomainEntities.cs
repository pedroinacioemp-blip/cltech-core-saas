namespace ClTechCore.Domain.Entities;

/// <summary>
/// Entidade: Usuário do sistema
/// </summary>
public class User : BaseEntity
{
    public string Email { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public bool IsActive { get; set; } = true;
    public DateTime? LastLoginAt { get; set; }
    public string? PhoneNumber { get; set; }
    public Guid TenantId { get; set; } // Multi-tenant
    
    // Relationships
    public virtual Tenant? Tenant { get; set; }
    public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    public virtual ICollection<Session> Sessions { get; set; } = new List<Session>();
    public virtual ICollection<Bot> Bots { get; set; } = new List<Bot>();
    public virtual ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();
}

/// <summary>
/// Entidade: Tenant (Cliente do SaaS)
/// </summary>
public class Tenant : BaseEntity
{
    public string Name { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public string? Logo { get; set; }
    public string Plan { get; set; } = "free"; // free, pro, enterprise
    public int MessageQuota { get; set; } = 100; // Msgs/mês
    public int BotLimit { get; set; } = 1;
    public int UserLimit { get; set; } = 1;
    public bool IsActive { get; set; } = true;
    public DateTime? TrialEndsAt { get; set; }
    
    // Relationships
    public virtual ICollection<User> Users { get; set; } = new List<User>();
    public virtual ICollection<Bot> Bots { get; set; } = new List<Bot>();
    public virtual ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
}

/// <summary>
/// Entidade: Role (Papel/Permissão)
/// </summary>
public class Role : BaseEntity
{
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    
    // Relationships
    public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    public virtual ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
}

/// <summary>
/// Entidade: Permission (Permissão)
/// </summary>
public class Permission : BaseEntity
{
    public string Name { get; set; } = null!; // "Users.Create", "Bots.Delete"
    public string Description { get; set; } = null!;
    
    // Relationships
    public virtual ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
}

/// <summary>
/// Entidade: Bot WhatsApp
/// </summary>
public class Bot : BaseEntity
{
    public string Name { get; set; } = null!;
    public string PhoneNumber { get; set; } = null!;
    public string Status { get; set; } = "inactive"; // inactive, active, paused
    public Guid TenantId { get; set; }
    public Guid CreatedByUserId { get; set; }
    public string? BaileySessionPath { get; set; }
    public bool EnableAI { get; set; } = true;
    public string? AIPrompt { get; set; }
    
    // Relationships
    public virtual Tenant? Tenant { get; set; }
    public virtual User? CreatedByUser { get; set; }
    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
    public virtual ICollection<BotConfig> Configs { get; set; } = new List<BotConfig>();
}

/// <summary>
/// Entidade: Mensagem
/// </summary>
public class Message : BaseEntity
{
    public Guid BotId { get; set; }
    public string FromNumber { get; set; } = null!;
    public string ToNumber { get; set; } = null!;
    public string Content { get; set; } = null!;
    public string Type { get; set; } = "text"; // text, image, video, audio, button, list
    public string Direction { get; set; } = "in"; // in, out
    public bool IsFromAI { get; set; }
    public string? AIResponseId { get; set; }
    
    // Relationships
    public virtual Bot? Bot { get; set; }
}

/// <summary>
/// Entidade: Configuração do Bot
/// </summary>
public class BotConfig : BaseEntity
{
    public Guid BotId { get; set; }
    public string Key { get; set; } = null!;
    public string Value { get; set; } = null!;
    public string Type { get; set; } = "string"; // string, int, bool, json
    
    // Relationships
    public virtual Bot? Bot { get; set; }
}

/// <summary>
/// Entidade: Sessão de Usuário
/// </summary>
public class Session : BaseEntity
{
    public Guid UserId { get; set; }
    public string Token { get; set; } = null!;
    public string RefreshToken { get; set; } = null!;
    public DateTime ExpiresAt { get; set; }
    public DateTime RefreshExpiresAt { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public bool IsRevoked { get; set; }
    
    // Relationships
    public virtual User? User { get; set; }
}

/// <summary>
/// Entidade: API Key
/// </summary>
public class ApiKey : BaseEntity
{
    public Guid TenantId { get; set; }
    public string Key { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Permissions { get; set; } = null!; // JSON array
    public DateTime? ExpiresAt { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? LastUsedAt { get; set; }
    
    // Relationships
    public virtual Tenant? Tenant { get; set; }
}

/// <summary>
/// Entidade: Log de Auditoria
/// </summary>
public class AuditLog : BaseEntity
{
    public Guid UserId { get; set; }
    public string EntityType { get; set; } = null!;
    public string Action { get; set; } = null!; // Create, Read, Update, Delete
    public string? OldValues { get; set; }
    public string? NewValues { get; set; }
    public string? IpAddress { get; set; }
    
    // Relationships
    public virtual User? User { get; set; }
}

/// <summary>
/// Entidade: Assinatura / Plano
/// </summary>
public class Subscription : BaseEntity
{
    public Guid TenantId { get; set; }
    public string Plan { get; set; } = "free"; // free, pro, enterprise
    public decimal Price { get; set; }
    public string Status { get; set; } = "active"; // active, canceled, expired
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? StripeSubscriptionId { get; set; }
    public string? PaymentMethod { get; set; } // stripe, mercadopago
    
    // Relationships
    public virtual Tenant? Tenant { get; set; }
}

/// <summary>
/// Entidade: Invoice / Fatura
/// </summary>
public class Invoice : BaseEntity
{
    public Guid SubscriptionId { get; set; }
    public Guid TenantId { get; set; }
    public string InvoiceNumber { get; set; } = null!;
    public decimal Amount { get; set; }
    public string Status { get; set; } = "pending"; // pending, paid, failed, canceled
    public DateTime DueDate { get; set; }
    public DateTime? PaidDate { get; set; }
    public string? StripeInvoiceId { get; set; }
    
    // Relationships
    public virtual Subscription? Subscription { get; set; }
    public virtual Tenant? Tenant { get; set; }
}

/// <summary>
/// Entidade: Relationship - Usuário X Papel
/// </summary>
public class UserRole
{
    public Guid UserId { get; set; }
    public Guid RoleId { get; set; }
    
    public virtual User? User { get; set; }
    public virtual Role? Role { get; set; }
}

/// <summary>
/// Entidade: Relationship - Papel X Permissão
/// </summary>
public class RolePermission
{
    public Guid RoleId { get; set; }
    public Guid PermissionId { get; set; }
    
    public virtual Role? Role { get; set; }
    public virtual Permission? Permission { get; set; }
}
