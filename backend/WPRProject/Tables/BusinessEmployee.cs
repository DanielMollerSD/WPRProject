using System.ComponentModel.DataAnnotations;

namespace WPRProject.Tables
{
    public class BusinessEmployee
    {
        [Key] public int Id { get; set; }
        public string Role { get; set; }
    }
}
