using System.ComponentModel.DataAnnotations;

namespace WPRProject.Tables
{
    public class Mail
    {
        [Key] public int Id {  get; set; }

        public string Topic { get; set; }
        public string Description { get; set; }
    }
}
