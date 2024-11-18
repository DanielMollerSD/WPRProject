using System.ComponentModel.DataAnnotations;

namespace WPRProject.Tables
{
    public class SubscriptionCoverage
    {
        [Key] public int Id { get; set; }
        public int DailyRentCoverage {  get; set; }
    }
}
