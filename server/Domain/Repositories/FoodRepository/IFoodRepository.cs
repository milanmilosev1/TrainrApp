using Domain.Models;

namespace Domain.Repositories.FoodRepository
{
    public interface IFoodRepository
    {
        Task<bool> AddAsync(Food food);
        Task<bool> UpdateAsync(Food food);
        Task<bool> DeleteAsync(Guid id);
        Task<Food?> GetByIdAsync(Guid id);
        Task<List<Food>> GetAllAsync();
    }
}
