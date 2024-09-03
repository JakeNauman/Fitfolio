using FitFolio.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Threading.Tasks;

namespace FitFolio.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FollowerController : ControllerBase
    {
        private readonly ILogger<FollowerController> _logger;
        private readonly UserManager<User> _userManager;

        public FollowerController(ILogger<FollowerController> logger, UserManager<User> userManager)
        {
            _logger = logger;
            _userManager = userManager;
        }

        [HttpPost()]
        public async Task<IActionResult> AddFollower([FromQuery] string friend1, [FromQuery] string friend2)
        {
            // get users
            var user1 = await _userManager.FindByNameAsync(friend1);
            var user2 = await _userManager.FindByNameAsync(friend2);

            if (user1 == null || user2 == null)
            {
                return NotFound("One or both users not found.");
            }

            // if followers/following is null, initialize lists
            user2.Followers = user2.Followers ?? Array.Empty<string>();
            user1.Following = user1.Following ?? Array.Empty<string>();

            // Add friend1 to user2 followers if not already present
            if (!user2.Followers.Contains(friend1))
            {
                user2.Followers = user2.Followers.Append(friend1).ToArray();
            }

            // Add friend2 to user1 following list if not already present
            if (!user1.Following.Contains(friend2))
            {
                user1.Following = user1.Following.Append(friend2).ToArray();
            }

            var result = await _userManager.UpdateAsync(user2);

            if (result.Succeeded)
            {
                // Also update user1
                var result1 = await _userManager.UpdateAsync(user1);
                if (result1.Succeeded)
                {
                    return Ok(new { Message = "Follower added successfully." });
                }
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            return BadRequest(ModelState);
        }


        [HttpDelete()]
        public async Task<IActionResult> RemoveFollower([FromQuery] string friend1, [FromQuery] string friend2)
        {
            // Retrieve the user objects
            var user1 = await _userManager.FindByNameAsync(friend1);
            var user2 = await _userManager.FindByNameAsync(friend2);

            if (user1 == null || user2 == null)
            {
                return NotFound("One or both users not found.");
            }

            // Initialize lists if null
            user2.Followers = user2.Followers ?? Array.Empty<string>();
            user1.Following = user1.Following ?? Array.Empty<string>();

            // Check if friend1 is a follower of friend2
            if (user2.Followers.Contains(friend1))
            {
                user2.Followers = user2.Followers.Where(follower => follower != friend1).ToArray();
                user1.Following = user1.Following.Where(follow => follow != friend2).ToArray();

                // Update the database
                var result2 = await _userManager.UpdateAsync(user2);

                if (result2.Succeeded)
                {
                    // Also update user1 to reflect following changes
                    var result1 = await _userManager.UpdateAsync(user1);
                    if (result1.Succeeded)
                    {
                        return Ok(new { Message = "Follower removed successfully." });
                    }
                }
                foreach (var error in result2.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }

            }
            else
            {
                return BadRequest("The specified user is not a follower.");
            }

            
            return BadRequest(ModelState);
        }


    }
}
