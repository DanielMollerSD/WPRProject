using System.ComponentModel.DataAnnotations;

namespace WPRProject.Tables
{
    public class Individual : Customer
    {
       

        [Required]
        [StringLength(10, MinimumLength = 10, ErrorMessage = "Voer een geldig 06-telefoonnummer in")]
        [Phone(ErrorMessage = "Voer een geldig telefoonnummer in")]
        public string PhoneNumber { get; set; } 

        [Required(ErrorMessage = "Adres is verplicht")]
        [StringLength(255, ErrorMessage = "Adres mag niet langer zijn dan 255 tekens")]
        public string Address { get; set; } 

        [Required(ErrorMessage = "Postcode is verplicht")]
        [RegularExpression(@"^[1-9][0-9]{3}\s?[A-Za-z]{2}$", ErrorMessage = "Voer een geldige postcode in")]
        public string PostalCode { get; set; }

       
    }
}
