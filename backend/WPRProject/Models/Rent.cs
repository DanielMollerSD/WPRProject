using System.ComponentModel.DataAnnotations;

namespace WPRProject.Tables
{
    public class Rent
    {
        [Key]
        public int Id { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Address { get; set; }

        public string TravelPurpose { get; set; }

        public string FurthestDestination { get; set; }

        public int ExpectedDistance { get; set; }

        public string PickupLocation { get; set; }

        public DateTime PickupTime { get; set; }

        public string SafetyInstructions { get; set; }

        [Required]
        public int VehicleId { get; set; }

        // Foreign key to Customer
        [Required] // Zorg ervoor dat een Rent altijd een Customer heeft
        public int CustomerId { get; set; }

        // Navigation property to Customer
        public Customer? Customer { get; set; }

        // Navigation property to Vehicle
        public Vehicle? Vehicle { get; set; }

        // Status property with validation
        public const string Pending = "pending";
        public const string Accepted = "accepted";
        public const string Declined = "declined";

        private string _status;
        public string Status
        {
            get => _status;
            set
            {
                if (value != Pending && value != Accepted && value != Declined)
                {
                    throw new ArgumentException("Invalid status value. Allowed values are: 'pending', 'accepted', 'declined'.");
                }
                _status = value;
            }
        }

        // Constructor with default status
        public Rent()
        {
            Status = Pending; // Default status
        }
    }
}
