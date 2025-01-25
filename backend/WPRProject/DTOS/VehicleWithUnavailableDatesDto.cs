public class VehicleWithUnavailableDatesDto
{
    public int Id { get; set; }
    public string LicensePlate { get; set; }
    public string Brand { get; set; }
    public string Model { get; set; }

    public string? Color { get; set; }
    public string? Status { get; set; }
    public string? Note { get; set; }
    public double Price { get; set; }
    public int PurchaseYear { get; set; }
    public string VehicleType { get; set; }
    public List<string> UnavailableDates { get; set; }
}
