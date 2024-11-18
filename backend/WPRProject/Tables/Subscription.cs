using System.ComponentModel.DataAnnotations;

namespace WPRProject.Tables
{
    public class Subscription
    {
        [Key] public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }



    }
}
