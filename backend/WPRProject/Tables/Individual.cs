using System.ComponentModel.DataAnnotations;

namespace WPRProject.Tables
{
    public class Individual
    {
        [Key] public int Id { get; set; }
        [StringLength(10, MinimumLength = 10, ErrorMessage = "Voer een geldig 06-telefoonnummer in")]
        public int PhoneNumber {  get; set; }
        public string Adress { get; set; }
    }
}
