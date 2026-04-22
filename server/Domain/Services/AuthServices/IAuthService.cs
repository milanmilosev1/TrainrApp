using Domain.Models;

namespace Domain.Services.AuthServices
{
    public  interface IAuthService
    {
        Task<User?> LoginAsync(string email, string password);
        Task<bool> RegisterAsync(User user, string password);
        Task<bool> LogoutAsync(Guid userId);
    }
}
