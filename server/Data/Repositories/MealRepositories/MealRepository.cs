using Domain.Models;
using Domain.Repositories.MealRepository;
using Microsoft.EntityFrameworkCore;

namespace Data.Repositories.MealRepositories
{
    public class MealRepository(AppDbContext context) : IMealRepository
    {
        private readonly AppDbContext _context = context;

        public async Task<bool> AddAsync(Meal meal)
        {
            var exists = await _context.Meals.AnyAsync(x => x.Id == meal.Id);

            if (exists)
                return false;

            if (meal.Id == Guid.Empty)
                meal.Id = Guid.NewGuid();

            await _context.Meals.AddAsync(meal);
            await _context.SaveChangesAsync();

            return true;
        }
        public async Task<bool> DeleteAsync(Guid id)
        {
            var found = await _context.Meals.FindAsync(id);
            if (found is null)
                return false;

            _context.Meals.Remove(found);
            await _context.SaveChangesAsync();

            return true;
        }
        public async Task<bool> UpdateAsync(Meal meal)
        {
            var exists = await _context.Meals.AnyAsync(x => x.Id == meal.Id);

            if (!exists)
                return false;

            _context.Meals.Update(meal);
            await _context.SaveChangesAsync();

            return true;
        }
        public async Task<List<Meal>> GetAllAsync() =>
            await _context.Meals.ToListAsync();
        public async Task<Meal?> GetByIdAsync(Guid id) =>
            await _context.Meals.FindAsync(id);
    }
}
