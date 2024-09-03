using System.ComponentModel.DataAnnotations;

namespace FitFolio.Data
{
    public enum PostType
    {
        Accomplishment,
        Text
    }
    public class Post
    {
        [Key] // Marks this property as the primary key
        public int Id { get; set; }
        public string UserName { get; set; }

        public string Content { get; set; }

        public PostType Type { get; set; }
        public string? AccomplishmentDetails { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;


    }
}
