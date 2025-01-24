using System.ComponentModel.DataAnnotations;


namespace WPRProject.DTOS
{

public class UpdateBusinessAccountDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string TussenVoegsel { get; set; }
    public string Email { get; set; }

     [StringLength(64, MinimumLength = 8, ErrorMessage = "Wachtwoord moet tenminste 8 tekens lang zijn.")]
    public string Password { get; set; }
    public string Role { get; set; }
}
}
