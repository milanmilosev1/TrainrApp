using Domain.Models;
using Domain.Repositories.UserRepositories;
using Domain.Services.AuthServices;

namespace Services.AuthServices
{
    public class AuthService(IUserRepository repository) : IAuthService
    {
        private readonly IUserRepository _repository = repository;

        public async Task<User?> LoginAsync(string email, string password)
        {
            var user = await _repository.GetByEmailAsync(email);
            if (user.PasswordHash != password)
                return new User();

            return user;
        }

        public async Task<bool> RegisterAsync(User user, string password)
        {
            var exists = await _repository.GetByEmailAsync(user.Email);
            if (exists is not null)
                return false;

            if (user.Id == Guid.Empty)
                user.Id = Guid.NewGuid();

            user.PasswordHash = password;

            await _repository.CreateAsync(user);
            return true;
        }

        public async Task<bool> LogoutAsync(Guid userId)
        {
            var exists = await _repository.GetByIdAsync(userId);
            return exists is not null;
        }
    }
}
