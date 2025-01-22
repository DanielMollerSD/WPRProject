using System.ComponentModel.DataAnnotations;
using WPRProject.Tables;

namespace WPRProject.DTOS
{
    public class BusinessEmployeeRegisterDto
    {
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string? TussenVoegsel { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string Role { get; set; }

 
    }

}