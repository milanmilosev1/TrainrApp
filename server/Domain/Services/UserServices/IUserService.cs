using Domain.Models;

namespace Domain.Services.UserServices
{
    public interface IUserService
    {
        Task<User> CreateNewUserAsync(User user);
        Task<User> DeleteOrDeactivateUserAsync(User user);
        Task<User> ChangeUserInfoAsync(User user);
        Task<User> GetUserByIdAsync(Guid id);
        Task<User> GetUserByUsernameAsync(string? username);
        Task<List<User>> GetAllUsersAsync();
        
        //Possible extension of this interfaces based on business needs
    }
}
