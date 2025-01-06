using System.ComponentModel.DataAnnotations;

namespace WPRProject.Tables
{
    public class Business : BusinessEmployee
    {
        public string BusinessName { get; set; }

        [Range(8, int.MaxValue, ErrorMessage = "Voer een geldig KVK-nummer in.")]
        public int Kvk { get; set; }

        public string BusinessAddress { get; set; }

        public string BusinessPostalCode { get; set; }
    }
}