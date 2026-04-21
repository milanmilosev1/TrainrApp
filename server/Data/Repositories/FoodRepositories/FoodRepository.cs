using Domain.Models;
using Domain.Repositories.FoodRepository;
using Microsoft.EntityFrameworkCore;

namespace Data.Repositories.FoodRepositories
{
    public class FoodRepository(AppDbContext context) : IFoodRepository
    {
        private readonly AppDbContext _context = context;

        public async Task<bool> AddAsync(Food food)
        {
            var exists = await _context.Foods.AnyAsync(x => x.Id == food.Id);

            if (exists)
                return false;

            if (food.Id == Guid.Empty)
                food.Id = Guid.NewGuid();

            await _context.Foods.AddAsync(food);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var food = await _context.Foods.FindAsync(id);

            if (food is null)
                return false;

            _context.Foods.Remove(food);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> UpdateAsync(Food food)
        {
            var found = await _context.Foods.FindAsync(food.Id);
            
            if (found is null)
                return false;

            found.Name = food.Name;
            found.Carbs = food.Carbs;
            found.Protein = food.Protein;
            found.Fat = food.Fat;
            found.CaloriesPerServing = food.CaloriesPerServing;

            await _context.SaveChangesAsync();  

            return true;
        }

        public async Task<List<Food>> GetAllAsync() =>
            await _context.Foods.ToListAsync();
        public async Task<Food?> GetByIdAsync(Guid id) =>
            await _context.Foods.FindAsync(id);
    }
}
