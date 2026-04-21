namespace Domain.Models
{
    public sealed class Workout
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public DateOnly Date { get; set; }
        public string? Name { get; set; }
        public string? Notes { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        //Navigation property for EFCore
        public User User { get; set; } = null!;
    }
}
