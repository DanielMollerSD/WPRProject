using System.ComponentModel.DataAnnotations;
namespace WPRProject.Tables
{
    public class SubscriptionDiscount
    {
        [Key] public int Id {get; set;}
        public double Discount { get; set;}
    }
}
