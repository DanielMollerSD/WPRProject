using System.ComponentModel.DataAnnotations;

namespace WPRProject.Tables
{
    public class BusinessEmployee : Customer
    {
        public string Role { get; set; }

        [Required]
        public int BusinessId { get; set; }
        public Business? Business { get; set; }
    }
}