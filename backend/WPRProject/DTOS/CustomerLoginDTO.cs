using System.ComponentModel.DataAnnotations;

namespace WPRProject.DTOS
{
    public class CustomerLoginDto
    {
      
        public string Email { get; set; }

        [StringLength(16), MinLength(3)]
        public string Password { get; set; }
    }
}
