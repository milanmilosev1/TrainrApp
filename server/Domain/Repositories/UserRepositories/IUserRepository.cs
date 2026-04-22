using Domain.Models;

namespace Domain.Repositories.UserRepositories
{
    public interface IUserRepository
    {
        Task<User> CreateAsync(User user);
        Task<User> UpdateAsync(User user);
        Task<bool> DeleteAsync(Guid id);
        Task<User?> GetByIdAsync(Guid id);
        Task<User> GetByUsernameAsync(string? username);
        Task<User?> GetByEmailAsync(string? email);
        Task<List<User>> GetAllAsync();
    }
}
