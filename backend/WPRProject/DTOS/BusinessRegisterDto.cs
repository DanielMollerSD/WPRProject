using System.ComponentModel.DataAnnotations;
using WPRProject.Tables;

namespace WPRProject.DTOS
{
    public class BusinessRegisterDto{
        public string BusinessName { get; set; }
        
        [Range(8, int.MaxValue, ErrorMessage = "KVK nummer moet uit 8 cijfers bestaan")]
        public int Kvk { get; set; }
        public string BusinessAddress { get; set; }
        public string BusinessPostalCode {get; set;}

       public BusinessEmployeeDto businessEmployee { get; set; }
    }   
    public class BusinessEmployeeDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string? TussenVoegsel { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string Role { get; set; }
}
}
