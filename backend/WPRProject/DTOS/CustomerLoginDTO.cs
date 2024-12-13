using System.ComponentModel.DataAnnotations;

namespace WPRProject.DTOS
{
    public class CustomerLoginDTO
    {
        [Key] public int Id { get; set; }
        public string Email { get; set; }

        [StringLength(16), MinLength(3)]
        public string Password { get; set; }
    }
}
