using FitFolio.Data;
using FitFolio.Models;
using MySqlX.XDevAPI.Common;
using Microsoft.EntityFrameworkCore;
using FitFolio.Controllers;

public class PostManager : IPostManager
{
    private readonly ApplicationDBContext _context;
    private readonly ILogger<PostController> _logger;

    public PostManager(ApplicationDBContext context, ILogger<PostController> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result> CreatePostAsync(Post post)
    {
        try
        {
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            return new Result { Success = true };
        }
        catch (Exception ex)
        {
            // Log the exception
            return new Result { Success = false, Errors = new List<string> { ex.Message } };
        }
    }

    public async Task<Post> GetPostByIdAsync(int postId)
    {
        return await _context.Posts.FindAsync(postId);
    }

    public async Task<IEnumerable<Post>> GetPostsByNameAsync(string userName)
    {
        return await _context.Posts
            .Where(p => p.UserName == userName) // Adjust property name as needed
            .ToListAsync();
    }
    public async Task<IEnumerable<Post>> GetAllPostsAsync()
    {
        return await _context.Posts.ToListAsync();
    }

    public async Task<bool> DeletePostAsync(int postId)
    {
        var post = await _context.Posts.FindAsync(postId);
        if (post == null)
        {
            return false;
        }

        _context.Posts.Remove(post);
        await _context.SaveChangesAsync();

        return true;
    }
    public async Task<List<Post>> GetPostsByUsersAsync(List<string> usernames)
    {

        return await _context.Posts
                             .Where(p => usernames.Contains(p.UserName))
                             .OrderByDescending(p => p.CreatedAt)
                             .ToListAsync();
    }
}

