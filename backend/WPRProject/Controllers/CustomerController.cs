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

        

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<Customer>> GetCustomers()
        {
            Console.WriteLine("Inside GET");

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

            // Log user info
            Console.WriteLine($"User: {customer.FirstName} {customer.LastName}, Email: {customer.Email}");


            return Ok(customer); // Return the logged-in user data
        }


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
        [HttpPut]
        public async Task<ActionResult> UpdateCustomer([FromBody] UpdateIndividualDto customerUpdateDto)
        {
            var userEmail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            // Fetch the current customer based on the logged-in user's email (or ID)
            var customer = await _context.Individual.FirstOrDefaultAsync(c => c.Email == userEmail);

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(customerUpdateDto.Password);

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
            if (!string.IsNullOrEmpty(customerUpdateDto.FirstName))
            {
                customer.FirstName = customerUpdateDto.FirstName;
            }
            if (!string.IsNullOrEmpty(customerUpdateDto.LastName))
            {
                customer.LastName = customerUpdateDto.LastName;
            }
            if (!string.IsNullOrEmpty(customerUpdateDto.Password))
            {
                // You should hash the password before saving it
                customer.Password = customerUpdateDto.Password;

            }

            await _context.SaveChangesAsync();

            return Ok(customer);  // Return the updated customer data
        }


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

            return NoContent();
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login(CustomerLoginDto loginDto)
        {
            var customer = await _context.Customer
            .FirstOrDefaultAsync(c => c.Email == loginDto.Email);

            if (customer == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, customer.Password))
            {
                return Unauthorized(new { Message = "Invalid credentials" });
            }

            var secretKey = _configuration["Jwt:Key"];
            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];

            if (string.IsNullOrEmpty(secretKey))
            {
                throw new ArgumentNullException("The JWT secret key is missing from configuration.");
            }

            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, (customer.FirstName ?? "") + " " + (customer.LastName ?? "")),
            new Claim(ClaimTypes.Email, customer.Email)
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.Now.AddMinutes(60 * 24 * 7),
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);


            Response.Cookies.Append("access_token", tokenString, new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.Now.AddMinutes(30)
            });


            return Ok(new { Token = tokenString });
        }

    }
}
