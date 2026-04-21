using Domain.Models;

namespace Domain.Repositories.WorkoutRepositories
{
    public interface IWorkoutRepository
    {
        Task<bool> AddAsync(Workout workout);
        Task<bool> UpdateAsync(Workout workout);
        Task<bool> DeleteAsync(Guid id);
        Task<Workout?> GetByIdAsync(Guid id);
        Task<List<Workout>> GetAllAsync();
    }
}
