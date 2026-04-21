using Domain.Enums.Meal;

namespace Domain.Models
{
    public sealed class Meal
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public MealType MealType { get; set; }
        public int Calories { get; set; }
        public double Protein { get; set; }
        public double Carbs { get; set; }
        public double Fat { get; set; }
        public int CookTimeMinutes { get; set; }
        public Difficulty Difficulty { get; set; }
        public string? Tags { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
