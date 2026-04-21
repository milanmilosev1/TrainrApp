using Domain.Models;
using Domain.Repositories.UserRepositories;
using Domain.Services.UserServices;

namespace Services.UserServices
{
    public class UserService(IUserRepository userRepository) : IUserService
    {
        private readonly IUserRepository _userRepository = userRepository;

        public async Task<User> CreateNewUserAsync(User user) =>
            await _userRepository.CreateAsync(user);

        public Task<User> ChangeUserInfoAsync(User user)
        {
            throw new NotImplementedException();
        }

        public Task<User> DeleteOrDeactivateUserAsync(User user)
        {
            throw new NotImplementedException();
        }

        public Task<List<User>> GetAllUsersAsync()
        {
            throw new NotImplementedException();
        }

        public Task<User> GetUserByIdAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task<User> GetUserByUsernameAsync(string? username)
        {
            throw new NotImplementedException();
        }
    }
}
