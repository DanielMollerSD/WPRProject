using System.ComponentModel.DataAnnotations;
namespace WPRProject.Tables
{
    public class SubscriptionOrder
    {
        [Key] public int Id { get; set; }
        public bool Verified { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        [Required]
        public int BusinessId { get; set; }
        public Business? Business { get; set; }

        [Required]  
        public int SubscriptionId { get; set; }
        public Subscription? Subscription { get; set; }
    }


}