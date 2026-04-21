using Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Data
{
    public class AppDbContext(DbContextOptions<DbContext> options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Workout> Workouts { get; set; }
    }
}
