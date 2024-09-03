using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using FitFolio.Models;
using Microsoft.EntityFrameworkCore;
using FitFolio.Data;
using Microsoft.AspNetCore.Identity;

namespace FitFolio.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        private readonly UserManager<User> _userManager;

        public UsersController(ApplicationDBContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        //Get all users
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<User>>> SearchUsers([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest("Search query cannot be empty.");
            }

            var lowerCaseQuery = query.ToLower();

            var users = await _context.Users
                .Where(u => u.UserName.ToLower().Contains(lowerCaseQuery))
                .ToListAsync();

            return Ok(users);
        }



        //Get user info given username
        [HttpGet("byusername")]
        public async Task<IActionResult> GetUser([FromQuery] string username)
        {
            if (string.IsNullOrEmpty(username))
            {
                return BadRequest("username is required.");
            }

            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var followersList = user.Followers?.ToList() ?? new List<string>();
            var followingList = user.Following?.ToList() ?? new List<string>();
            return Ok(new
            {
                username = user.UserName,
                email = user.Email,
                followers = followersList,
                following = followingList
            });
        }
    }
}