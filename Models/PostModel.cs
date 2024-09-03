namespace FitFolio.Data
{
    using System.ComponentModel.DataAnnotations;

    public class PostModel
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        public string Content { get; set; }

        [Required]
        public PostType Type { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }

        public string AccomplishmentDetails { get; set; }

        
    }
}