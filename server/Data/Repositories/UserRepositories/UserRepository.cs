using Domain.Models;
using Domain.Repositories.UserRepositories;
using Microsoft.EntityFrameworkCore;

namespace Data.Repositories.UserRepositories
{
    public class UserRepository(AppDbContext dbContext) : IUserRepository
    {
        private readonly AppDbContext _dbContext = dbContext;
        public async Task<User> CreateAsync(User user)
        {
            var foundUser = await GetByIdAsync(user.Id);
            if (foundUser is null)
                return new User();

            await _dbContext.Users.AddAsync(user);
            await _dbContext.SaveChangesAsync();
            return user;
        }

        public Task<bool> DeleteAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task<List<User>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<User?> GetByEmailAsync(string? email)
        {
            return await _dbContext.Users.FirstOrDefaultAsync(x => x.Email == email);
        }

        public async Task<User?> GetByIdAsync(Guid id) =>
            await _dbContext.Users.FindAsync(id);
        public Task<User> GetByUsernameAsync(string? username)
        {
            throw new NotImplementedException();
        }

        public Task<User> UpdateAsync(User user)
        {
            throw new NotImplementedException();
        }
    }
}
