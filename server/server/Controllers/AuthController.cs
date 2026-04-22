using Domain.Models;
using Domain.Services.AuthServices;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Route("/auth")]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        private readonly IAuthService _authService = authService;

        [HttpPost]
        [Route("/login")]
        public async Task<IActionResult> Login(string email, string password)
        {
            var result = await _authService.LoginAsync(email, password);
            if (result!.Id == Guid.Empty)
            {
                return NotFound("User not found");
            }

            return Ok("Login succesfull");
        }

        [HttpPost]
        [Route("/register")]
        public async Task<IActionResult> Register(User user, string password)
        {
            var result = await _authService.RegisterAsync(user, password);
            if (!result)
            {
                return BadRequest("Entity already found");
            }

            return Ok("register succesfull");
        }
    }
}
