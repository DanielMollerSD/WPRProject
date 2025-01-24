using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WPRProject.DTOS;
using WPRProject.Tables;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;
using BCrypt.Net;

namespace WPRProject.Controllers

{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {

        private readonly CarsAndAllContext _context;
        private readonly IConfiguration _configuration;

        public CustomerController(CarsAndAllContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        
        [Authorize (Roles = "Owner, Individual, Wagenparkbeheerder")]
        [HttpGet]
        public async Task<ActionResult<Customer>> GetCustomers()
        {
            // Access user information from claims
            var userEmail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized(new { Message = "User is not authenticated." });
            }

            // Find the customer using the email of the logged-in user
            var customer = await _context.Customer
                                          .FirstOrDefaultAsync(c => c.Email == userEmail);

            if (customer == null)
            {
                return NotFound(new { Message = "Customer not found." });
            }

            return Ok(customer); // Return the logged-in user data
        }

        [Authorize(Roles = "Owner, Wagenparkbeheerder, Individual")]
        [HttpGet("{Id}")]
        public async Task<ActionResult<Customer>> GetOneCustomer(int id)
        {

            var customer = await _context.Customer.FindAsync(id);

            if (customer == null)
            {

                return NotFound();
            }

            return customer;
        }

        [Authorize(Roles = "Owner, Wagenparkbeheerder")]
        [HttpPost]
        public async Task<ActionResult<Customer>> CreateCustomer(Customer customer)
        {
            if (customer == null)
            {
                return BadRequest("Customer data is invalid.");
            }

            _context.Customer.Add(customer);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOneCustomer), new { id = customer.Id }, customer);
        }


        [Authorize(Roles = "Individual")]
        [HttpPut("updateIndividual")]
        public async Task<ActionResult> UpdateCustomer([FromBody] UpdateIndividualDto customerUpdateDto)
        {
            var userEmail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            // Fetch the current customer based on the logged-in user's email (or ID)
            var customer = await _context.Individual.FirstOrDefaultAsync(c => c.Email == userEmail);

            if (customer == null)
            {
                return NotFound("Customer not found.");
            }
            // Only update fields that are provided in the DTO
            if (!string.IsNullOrEmpty(customerUpdateDto.Email))
            {
                customer.Email = customerUpdateDto.Email;
            }
            if (!string.IsNullOrEmpty(customerUpdateDto.Address))
            {
                customer.Address = customerUpdateDto.Address;
            }
            if (!string.IsNullOrEmpty(customerUpdateDto.PostalCode))
            {
                customer.PostalCode = customerUpdateDto.PostalCode;
            }

             if (!string.IsNullOrEmpty(customerUpdateDto.PhoneNumber))
            {
                customer.PhoneNumber = customerUpdateDto.PhoneNumber;
            }
            
            if (!string.IsNullOrEmpty(customerUpdateDto.Password))
            {
                // Hash the password before saving it
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(customerUpdateDto.Password);
                customer.Password = hashedPassword;
            }

            await _context.SaveChangesAsync();

            return Ok(customer); // Return the updated customer data
        }


        [Authorize(Roles = "Owner, Wagenparkbeheerder, Individual")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {

            var customer = await _context.Customer.FindAsync(id);
            if (customer == null)
            {
                return NotFound();
            }

            _context.Customer.Remove(customer);
            await _context.SaveChangesAsync();

             Response.Cookies.Delete("access_token", new CookieOptions
            {
                Path = "/",
                HttpOnly = true,
                Secure = Request.IsHttps,
                SameSite = SameSiteMode.None,
            });

            return NoContent();
        }


    }
}
