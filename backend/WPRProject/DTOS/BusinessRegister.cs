using System.ComponentModel.DataAnnotations;

namespace WPRProject.DTOS
{
    public class BusinessRegister{

        public string Email {get; set; }
        public string Password { get; set; }
        public string BusinessName { get; set; }
        
        [Range(8, int.MaxValue, ErrorMessage = "KVK nummer moet uit 8 cijfers bestaan")]
        public int Kvk { get; set; }
        public string BusinessAddress { get; set; }
        public string BusinessPostalCode {get; set;}
    }



}
