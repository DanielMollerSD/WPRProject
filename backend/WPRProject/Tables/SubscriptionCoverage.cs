using System.ComponentModel.DataAnnotations;

namespace WPRProject.Tables
{
    public class SubscriptionCoverage : Subscription
    {
        [Key] public int Id { get; set; }
        public double DailyRentCoverage {  get; set; }
    }
}
