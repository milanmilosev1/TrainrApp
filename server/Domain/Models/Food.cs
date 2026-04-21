namespace Domain.Models
{
    public sealed class Food
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public int CaloriesPerServing { get; set; }
        public double Protein { get; set; }
        public double Carbs { get; set; }
        public double Fat { get; set; }
        public string? ServingSize { get; set; }
    }
}
