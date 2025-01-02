
using System.ComponentModel.DataAnnotations;

namespace WPRProject.Tables

{
    public class Business
    {
        [Key] public int Id { get; set; }
        public string BusinessName { get; set; }

        [Range(8,int.MaxValue ,ErrorMessage="Voer een geldig KVK-nummer in.")]
        public int Kvk { get; set; }
        public string Email {get; set; }
        public string Password { get; set; }
        public string BusinessAddress { get; set; }
        public string BusinessPostalCode {get; set;}
    }
}
