using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace WPRProject.Tables
{
    public class Business 
    {
        [Key]public int BusinessId {get;set;} 

        [Required]
        public string BusinessName { get; set; }

        [Range(8, int.MaxValue, ErrorMessage = "Voer een geldig KVK-nummer in.")]
        public int Kvk { get; set; }

        [Required]
        public string BusinessAddress { get; set; }

        [Required]
        public string BusinessPostalCode { get; set; }

        [JsonIgnore]
        public ICollection<BusinessEmployee>? BusinessEmployees { get; set; }

        [JsonIgnore]
        
        public ICollection<SubscriptionOrder>? SubscriptionOrders { get; set; }

//         [JsonIgnore]
//         public ICollection<BusinessEmployee> Employees {get;set;} = new List<BusinessEmployee>();

  }
}