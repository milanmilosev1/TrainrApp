using Domain.Models;
using Domain.Repositories.WorkoutRepositories;
using Microsoft.EntityFrameworkCore;

namespace Data.Repositories.WorkoutRepositories
{
    public class WorkoutRepository(AppDbContext context) : IWorkoutRepository
    {
        private readonly AppDbContext _context = context;
        public async Task<bool> AddAsync(Workout workout)
        {
            var exists = await _context.Workouts.AnyAsync(x =>
                x.UserId == workout.UserId &&
                x.Date == workout.Date &&
                x.Name == workout.Name);

            if (exists)
                return false;

            if (workout.Id == Guid.Empty)
                workout.Id = Guid.NewGuid();

            await _context.Workouts.AddAsync(workout);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var workout = await _context.Workouts.FindAsync(id);

            if (workout is null)
                return false;

            _context.Workouts.Remove(workout);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> UpdateAsync(Workout workout)
        {
            var existing = await _context.Workouts.FindAsync(workout.Id);

            if (existing is null)
                return false;

            existing.Name = workout.Name;
            existing.Notes = workout.Notes;
            existing.Date = workout.Date;
            existing.IsCompleted = workout.IsCompleted;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<List<Workout>> GetAllAsync() =>
            await _context.Workouts.ToListAsync();

        public async Task<Workout?> GetByIdAsync(Guid id) =>
            await _context.Workouts.FindAsync(id);

    }
}
