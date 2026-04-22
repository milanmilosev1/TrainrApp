namespace Domain.Models
{
    public sealed class User
    {
        public Guid Id { get; set; }
        public string? Name { get; set; } = string.Empty;
        public string? Email { get; set; } = string.Empty;
        public string? PasswordHash { get; set; } = string.Empty;
        public int Age { get; set; }
        public int Weigth { get; set; }
        public int Heigth { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public User() => Id = Guid.Empty;
    }
}
