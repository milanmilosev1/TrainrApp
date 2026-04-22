using Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Workout> Workouts { get; set; }
        public DbSet<Food> Foods { get; set; }
        public DbSet<Meal> Meals { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id");

                entity.Property(x => x.Email)
                    .HasColumnName("email")
                    .HasMaxLength(255);

                entity.Property(x => x.PasswordHash)
                    .HasColumnName("password_hash");

                entity.Property(x => x.Name)
                    .HasColumnName("name")
                    .HasMaxLength(150);

                entity.Property(x => x.Age)
                    .HasColumnName("age");

                entity.Property(x => x.Weigth)
                    .HasColumnName("weight")
                    .HasColumnType("numeric(5,2)");

                entity.Property(x => x.Heigth)
                    .HasColumnName("height")
                    .HasColumnType("numeric(5,2)");

                entity.Property(x => x.CreatedAt)
                    .HasColumnName("created_at");

                entity.Property(x => x.UpdatedAt)
                    .HasColumnName("updated_at");
            });

            modelBuilder.Entity<Workout>().ToTable("workouts");
            modelBuilder.Entity<Food>().ToTable("foods");
            modelBuilder.Entity<Meal>().ToTable("meals");
        }
    }
}
