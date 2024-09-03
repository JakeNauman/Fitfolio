using System.ComponentModel.DataAnnotations;

namespace FitFolio.Data
{
    public class LoginModel
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
