using FitFolio.Data;
using FitFolio.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Runtime.Intrinsics.X86;

namespace FitFolio.Controllers
{
    [ApiController]
    [Route("[controller]")]
    //  /weatherforecast
    public class PostController : ControllerBase
    {

        private readonly IPostManager _postManager;
        private readonly ApplicationDBContext _dbcontext;


        private readonly ILogger<PostController> _logger;

        public PostController(IPostManager postManager, ILogger<PostController> logger, UserManager<User> userManager, ApplicationDBContext db)
        {
            _postManager = postManager;
            _logger = logger;
            _dbcontext = db;
        }

        [HttpPost]
        public async Task<IActionResult> PostPost(PostModel model)
        {
            if (ModelState.IsValid)
            {
                var post = new Post
                {
                    UserName = model.UserName,
                    Content = model.Content,
                    Type = model.Type,
                    CreatedAt = DateTime.UtcNow, // Assume CreatedAt is set to the current time
                    AccomplishmentDetails = model.AccomplishmentDetails,
                };

                var result = await _postManager.CreatePostAsync(post);

                if (result.Success)
                {
                    return Ok(new { Message = "Post created successfully" });
                }

                // Assuming result has an Errors property
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error);
                }
            }

            return BadRequest(ModelState);
        }


        //get posts
        [HttpGet("byusername")]
        public async Task<IActionResult> GetByUser([FromQuery] string username)
        {
            var posts = await _postManager.GetPostsByNameAsync(username);


            return Ok(posts);
        }



        [HttpGet("userfeed")]
        public async Task<IActionResult> GetUserFeed([FromQuery] string username)
        {
            _logger.LogInformation("Fetching posts for user: {username}", username);

            var user = await _dbcontext.Users
                                .FirstOrDefaultAsync(u => u.UserName == username);

            if (user == null)
            {
                return NotFound($"User '{username}' not found.");
            }

            var followingList = user.Following ?? Array.Empty<string>();

            _logger.LogInformation("Following list retrieved for user '{username}': {followingList}", username, string.Join(", ", followingList));

            if (!followingList.Any())
            {
                return Ok(new List<Post>()); // Return an empty list if the user is not following anyone
            }
            var followingListAsList = followingList.ToList();

            var posts = await _postManager.GetPostsByUsersAsync(followingListAsList);

            return Ok(posts);
        }

    }

}