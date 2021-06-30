using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        //good for validation
        [Required]
        public string Username { set; get; }
        [Required]
        [StringLength(8, MinimumLength = 4)]
        public string Password { set; get; }
    }
}