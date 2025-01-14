using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace WPRProject.Tables
{
    public class Vehicle
{
    public int Id { get; set; }

    [Required]
    public string LicensePlate { get; set; }

    [Required]
    public string Brand { get; set; }

    [Required]
    public string Model { get; set; }

    public string Color { get; set; }
    public string Status { get; set; }
    public string Note { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Prijs moet een positief nummer zijn.")]
    public double Price { get; set; }

    [Range(1900, 2100, ErrorMessage = "Voer een geldig jaar in.")]
    public int PurchaseYear { get; set; }

    [Required]
    public string VehicleType { get; set; }
    [JsonIgnore]
        // Navigation property to link rents (one-to-many)
        public ICollection<Rent>? Rents { get; set; }

    [JsonIgnore]
    // Navigation property to link damages (one-to-many)
    public ICollection<Damage>? Damages { get; set; }
}
}