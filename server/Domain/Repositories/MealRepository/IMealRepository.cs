using Domain.Models;

namespace Domain.Repositories.MealRepository
{
    public interface IMealRepository
    {
        Task<bool> AddAsync(Meal meal);
        Task<bool> UpdateAsync(Meal meal);
        Task<bool> DeleteAsync(Guid id);
        Task<Meal?> GetByIdAsync(Guid id);
        Task<List<Meal>> GetAllAsync();
    }
}
