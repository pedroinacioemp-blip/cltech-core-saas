using System.Collections.Generic;

namespace ClTechCore.Domain.Entities
{
    public class Bot : AuditableEntity
    {
        public string Name { get; set; } = string.Empty;
        public bool IsEnabled { get; set; } = true;
        public ICollection<Message> Messages { get; set; } = new List<Message>();
    }
}
