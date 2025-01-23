namespace WPRProject.DTOS
{
    public class RentRequestsDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        
        // Properties specific to Individual
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
    }
}