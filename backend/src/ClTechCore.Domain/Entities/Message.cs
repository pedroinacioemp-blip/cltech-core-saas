using System;

namespace ClTechCore.Domain.Entities
{
    public class Message : AuditableEntity
    {
        public Guid BotId { get; set; }
        public Bot Bot { get; set; } = null!;
        public string Content { get; set; } = string.Empty;
        public string Sender { get; set; } = string.Empty;
        public bool IsFromAi { get; set; }
    }
}
