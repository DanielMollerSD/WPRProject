using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace WPRProject.Tables
{
    public class Subscription
    {
        [Key] public int Id { get; set; }
        
        public string Name { get; set; }
        public string Description { get; set; }
       
        public double Price { get; set; }

        [JsonIgnore]
        public ICollection<SubscriptionOrder>? SubscriptionOrders { get; set; }

    }
}
