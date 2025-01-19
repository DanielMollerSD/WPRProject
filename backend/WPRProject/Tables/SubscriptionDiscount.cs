using System.ComponentModel.DataAnnotations;
namespace WPRProject.Tables
{
    public class SubscriptionDiscount : Subscription
    {
        [Key] public int Id {get; set;}
        public double Discount { get; set;}
    }
}
