using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;

namespace WPRProject.Tables
{
    public class Rent
    {
        [Key] 
        public int Id { get; set; }

        public bool Verified { get; set; }

        public DateTime StartDate {  get; set; }

        public DateTime EndDate { get; set; }
      
        public string FirstName {  get; set; }
   
        public string LastName { get; set; }
     
        public string Address {  get; set; }

        public string TravelPurpose {get; set; }
  
        public string FurthestDestination {  get; set; }

        public int ExpectedDistance {  get; set; }
  
        public string PickupLocation {  get; set; }
  
        public DateTime PickupTime { get; set; }
   
        public string SafetyInstructions { get; set; }

    
        public int? VehicleId { get; set; }

        // Navigation property to Vehicle
        public Vehicle? Vehicle { get; set; }
    }
}
