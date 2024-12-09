
using System.ComponentModel.DataAnnotations;

namespace WPRProject.Tables

{
    public class Business
    {
        [Key] public int Id { get; set; }

       
        public string Name { get; set; }
        
        [StringLength(8, MinimumLength = 8, ErrorMessage = "KVK nummer moet uit 8 cijfers bestaan")]
        public int Kvk { get; set; }
      
        public string Adress { get; set; }
    }
}
