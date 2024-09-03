using FitFolio.Data;
using MySqlX.XDevAPI.Common;

public interface IPostManager
{
    Task<Result> CreatePostAsync(Post post);
    Task<Post> GetPostByIdAsync(int postId);
    Task<IEnumerable<Post>> GetPostsByNameAsync(string userName);
    Task<IEnumerable<Post>> GetAllPostsAsync();
    Task<bool> DeletePostAsync(int postId);
    Task<List<Post>> GetPostsByUsersAsync(List<string> usernames);
}
