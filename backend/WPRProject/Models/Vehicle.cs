using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace WPRProject.Tables
{
    public class Vehicle
    {
        [Key] public int Id { get; set; }
      
        public string LicensePlate { get; set; }
   
        public string Brand { get; set; }
       
        public string Model { get; set; }
       
        public string Color { get; set; }
        public string Status { get; set; }
        public string Note { get; set; }
      
        public double Price {  get; set; }

        [StringLength(4, MinimumLength = 4, ErrorMessage ="Voer een geldig jaar getal in")]
        public int PurchaseYear {  get; set; }
        public string VehicleType {  get; set; }

        [JsonIgnore]
        public ICollection<Rent> Rents { get; set; }

    }
}
