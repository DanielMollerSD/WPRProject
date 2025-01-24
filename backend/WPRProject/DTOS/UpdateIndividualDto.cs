using System.ComponentModel.DataAnnotations;


public class UpdateIndividualDto
{
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? PostalCode { get; set; }

     [StringLength(64, MinimumLength = 8, ErrorMessage = "Wachtwoord moet tenminste 8 tekens lang zijn.")]
    public string? Password { get; set; }  
    public string? PhoneNumber {get; set;}
}
