using System;

namespace ClTechCore.Domain.Entities
{
    public class ApiKey : AuditableEntity
    {
        public string Key { get; set; } = string.Empty;
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;
        public DateTime ExpiresAt { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
