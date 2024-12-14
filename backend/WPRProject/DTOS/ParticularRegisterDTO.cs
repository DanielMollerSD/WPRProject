using System.ComponentModel.DataAnnotations;

namespace WPRProject.DTOS
{
    public class ParticularRegisterDto
    {
        [Required(ErrorMessage = "Email is verplicht")]
        [EmailAddress(ErrorMessage = "Voer een geldig e-mailadres in")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Wachtwoord is verplicht")]
        [StringLength(16, MinimumLength = 3, ErrorMessage = "Wachtwoord moet tussen 3 en 16 tekens zijn")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Telefoonnummer is verplicht")]
        [StringLength(10, MinimumLength = 10, ErrorMessage = "Voer een geldig 06-telefoonnummer in")]
        [RegularExpression(@"^06\d{8}$", ErrorMessage = "Voer een geldig 06-telefoonnummer in")]
        public string PhoneNumber { get; set; }

        [Required(ErrorMessage = "Adres is verplicht")]
        public string Address { get; set; }

        [Required(ErrorMessage = "Postcode is verplicht")]
        public string PostalCode { get; set; }

        // Customer-specific properties
        [Required(ErrorMessage = "Voornaam is verplicht")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Achternaam is verplicht")]
        public string LastName { get; set; }

        public string TussenVoegsel { get; set; }
    }
}
