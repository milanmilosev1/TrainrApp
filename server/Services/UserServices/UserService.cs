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

        public async Task<User> ChangeUserInfoAsync(User user) =>
            await _userRepository.UpdateAsync(user);

        public async Task<User> DeleteUserAsync(User user)
        {
            var result = await _userRepository.DeleteAsync(user.Id);
            
            if (result is true)
                return user;
            else
                return new User();
        }
        public async Task<List<User>> GetAllUsersAsync() =>
            await _userRepository.GetAllAsync();

        public async Task<User> GetUserByIdAsync(Guid id) =>
            await _userRepository.GetByIdAsync(id);

        public async Task<User> GetUserByUsernameAsync(string? username) =>
            await _userRepository.GetByUsernameAsync(username);
    }
}
