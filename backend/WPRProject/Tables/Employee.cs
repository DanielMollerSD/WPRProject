using System.ComponentModel.DataAnnotations;

namespace WPRProject.Tables
{
    public class Employee
    {
        [Key] public int Id { get; set; }
        public string Role { get; set; }
        public string Email {get; set;}
        public string Password {get; set;}
    }
}
