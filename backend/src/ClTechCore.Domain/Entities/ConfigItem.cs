namespace ClTechCore.Domain.Entities
{
    public class ConfigItem : AuditableEntity
    {
        public string Key { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
    }
}
