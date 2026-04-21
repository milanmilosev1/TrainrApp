using Domain.Models;
using Domain.Services.UserServices;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Route("/users")]
    public class UserController(IUserService userService) : ControllerBase
    {
        private readonly IUserService _userService = userService;
        [HttpPost]
        public async Task<IActionResult> AddNewUser(User user)
        {
            var found = await _userService.CreateNewUserAsync(user);

            if (found.Id == Guid.Empty)
            {
                return BadRequest("User already exists!");
            }
            return Ok("User added succesfully");
        }
    }
}
