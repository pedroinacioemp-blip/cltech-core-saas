namespace ClTechCore.Application.DTOs;

/// <summary>
/// DTOs para User
/// </summary>
public class UserRegisterDto
{
    public string Email { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string? PhoneNumber { get; set; }
}

public class UserLoginDto
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
}

public class UserDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public bool IsActive { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public string? PhoneNumber { get; set; }
    public Guid TenantId { get; set; }
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// DTOs para Bot
/// </summary>
public class CreateBotDto
{
    public string Name { get; set; } = null!;
    public string PhoneNumber { get; set; } = null!;
    public bool EnableAI { get; set; } = true;
    public string? AIPrompt { get; set; }
}

public class UpdateBotDto
{
    public string? Name { get; set; }
    public string? Status { get; set; }
    public bool? EnableAI { get; set; }
    public string? AIPrompt { get; set; }
}

public class BotDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string PhoneNumber { get; set; } = null!;
    public string Status { get; set; } = null!;
    public bool EnableAI { get; set; }
    public string? AIPrompt { get; set; }
    public Guid TenantId { get; set; }
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// DTOs para Message
/// </summary>
public class SendMessageDto
{
    public Guid BotId { get; set; }
    public string PhoneNumber { get; set; } = null!;
    public string Content { get; set; } = null!;
    public string Type { get; set; } = "text"; // text, image, video
    public string? MediaUrl { get; set; }
}

public class MessageDto
{
    public Guid Id { get; set; }
    public Guid BotId { get; set; }
    public string FromNumber { get; set; } = null!;
    public string ToNumber { get; set; } = null!;
    public string Content { get; set; } = null!;
    public string Type { get; set; } = null!;
    public string Direction { get; set; } = null!;
    public bool IsFromAI { get; set; }
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// DTOs para Authentication
/// </summary>
public class AuthResponseDto
{
    public UserDto User { get; set; } = null!;
    public string AccessToken { get; set; } = null!;
    public string RefreshToken { get; set; } = null!;
    public DateTime ExpiresAt { get; set; }
}

public class RefreshTokenDto
{
    public string RefreshToken { get; set; } = null!;
}

/// <summary>
/// DTOs para Tenant/Subscription
/// </summary>
public class TenantDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public string? Logo { get; set; }
    public string Plan { get; set; } = null!;
    public int MessageQuota { get; set; }
    public int BotLimit { get; set; }
    public int UserLimit { get; set; }
}

public class SubscriptionDto
{
    public Guid Id { get; set; }
    public string Plan { get; set; } = null!;
    public decimal Price { get; set; }
    public string Status { get; set; } = null!;
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}

/// <summary>
/// DTOs para API Response
/// </summary>
public class ApiResponseDto<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = null!;
    public T? Data { get; set; }
    public Dictionary<string, string>? Errors { get; set; }
}

public class PaginatedResponseDto<T>
{
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages { get; set; }
    public IEnumerable<T> Items { get; set; } = new List<T>();
    public bool HasNext { get; set; }
    public bool HasPrevious { get; set; }
}
