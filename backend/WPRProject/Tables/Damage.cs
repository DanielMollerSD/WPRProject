using System.ComponentModel.DataAnnotations;

namespace WPRProject.Tables
{
    public class Damage
    {
        [Key] public int Id { get; set; }
        
        public string Description {  get; set; }
    }
}
