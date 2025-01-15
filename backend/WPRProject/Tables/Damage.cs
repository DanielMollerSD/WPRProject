using System.ComponentModel.DataAnnotations;

namespace WPRProject.Tables
{
    public class Damage
    {
        [Key] public int Id { get; set; }
        
        public string Description {  get; set; }

        public string Status {  get; set; } = "Pending";

        [Required]
        public int VehicleId { get; set; }

        // Navigation property to Vehicle
        public Vehicle? Vehicle { get; set; }
    }
}
