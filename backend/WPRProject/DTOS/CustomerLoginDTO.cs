using System.ComponentModel.DataAnnotations;

namespace WPRProject.DTOS
{
    public class CustomerLoginDto
    {
      
    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string Email { get; set; }

      
    [Required(ErrorMessage = "Password is required.")]
    [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be at least 8 characters long.")]
        public string Password { get; set; }
    }
}
