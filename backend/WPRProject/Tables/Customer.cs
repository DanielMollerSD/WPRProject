using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;

namespace WPRProject.Tables
{
    public class Customer 
    {
        [Key] public int Id { get; set; }

        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }

        public string? TussenVoegsel { get; set; } 
        [Required]
        public string Email { get; set; }

        [Required]
        [StringLength(64, MinimumLength = 8, ErrorMessage = "Wachtwoord moet tenminste 8 tekens lang zijn.")]
        public string Password { get; set; }
        
        [JsonIgnore]
        public ICollection<Rent>? Rents { get; set; }
    }
}
