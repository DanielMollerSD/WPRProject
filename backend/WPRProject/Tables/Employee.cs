using System.ComponentModel.DataAnnotations;

namespace WPRProject.Tables
{
    public class Employee
    {
        [Key] public int Id { get; set; }
        public string Role { get; set; }
        public string Email {get; set;}

        [StringLength(64, MinimumLength = 8, ErrorMessage = "Wachtwoord moet tenminste 8 tekens lang zijn.")]
        public string Password {get; set;}
    }
}
