using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WPRProject.Tables;
using WPRProject.DTOS;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using System.Linq;

namespace WPRProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BusinessController : ControllerBase
    {
        private readonly CarsAndAllContext _context;

        public BusinessController(CarsAndAllContext context)
        {
            _context = context;
        }

        // Get business associated with the logged-in user
        [Authorize(Roles = "Owner")]
        [HttpGet]
        public async Task<ActionResult<Business>> GetBusinessDetails()
        {
            var userEmail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized(new { Message = "User is not authenticated." });
            }

            var business = await _context.Business
                .Where(b => b.Employees.Any(e => e.Email == userEmail))
                .FirstOrDefaultAsync();

            if (business == null)
            {
                return NotFound(new { Message = "Business not found for this user." });
            }

            return Ok(business);
        }

        // Get all employees of the business
        [HttpGet("employees")]
        public async Task<IActionResult> GetEmployees()
        {
            var userEmail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized("User not authenticated.");
            }

            var business = await _context.Business
                .Include(b => b.Employees)
                .FirstOrDefaultAsync(b => b.Employees.Any(e => e.Email == userEmail));

            if (business == null)
            {
                return NotFound("No business found for the logged-in user.");
            }

            var employees = business.Employees;

            if (employees == null || !employees.Any())
            {
                return NotFound("No employees found for this business.");
            }

            return Ok(new { employees = employees });
        }

        // Get business by ID
        [HttpGet("business/{id}")]
        public async Task<ActionResult<Business>> GetBusinessById(int id)
        {
            var business = await _context.Business.FindAsync(id);

            if (business == null)
            {
                return NotFound(new { Message = "Business not found." });
            }

            return Ok(business);
        }

        // Delete a business account
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBusinessAccount(int id)
        {
            var businessAccount = await _context.Business.FindAsync(id);
            if (businessAccount == null)
            {
                return NotFound(new { Message = "Business account not found." });
            }

            _context.Business.Remove(businessAccount);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Account deleted successfully" });
        }

        // Register a new business with an employee
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] BusinessRegisterDto registerDto)
        {
            if (registerDto.businessEmployee == null)
            {
                return BadRequest(new { Message = "Business employee data is missing." });
            }

            try
            {
                // Check if KvK already exists
                var existingBusiness = await _context.Business
                    .FirstOrDefaultAsync(b => b.Kvk == registerDto.Kvk);

                if (existingBusiness != null)
                {
                    return BadRequest(new { Message = "Kvk is already in use." });
                }

                // Hash employee password
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(registerDto.businessEmployee.Password);

                // Create the business
                var newBusiness = new Business
                {
                    BusinessName = registerDto.BusinessName,
                    BusinessAddress = registerDto.BusinessAddress,
                    Kvk = registerDto.Kvk,
                    BusinessPostalCode = registerDto.BusinessPostalCode,
                };

                // Add and save the business to generate BusinessId
                _context.Business.Add(newBusiness);
                await _context.SaveChangesAsync();

                // Create the business employee
                var newBusinessEmployee = new BusinessEmployee
                {
                    FirstName = registerDto.businessEmployee.FirstName,
                    LastName = registerDto.businessEmployee.LastName,
                    TussenVoegsel = registerDto.businessEmployee.TussenVoegsel,
                    Email = registerDto.businessEmployee.Email,
                    Password = hashedPassword,
                    Role = registerDto.businessEmployee.Role,
                    BusinessId = newBusiness.BusinessId
                };

                _context.Customer.Add(newBusinessEmployee);
                await _context.SaveChangesAsync();

                return Ok(new { Business = newBusiness, Employee = newBusinessEmployee });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while registering the business.", Details = ex.Message });
            }
        }

        // Update business details
        [HttpPut("updateBusiness")]
        public async Task<ActionResult> UpdateBusiness([FromBody] UpdateBusinessDto updateBusinessDto)
        {
            if (updateBusinessDto == null)
            {
                return BadRequest(new { Message = "Invalid data provided." });
            }

            var business = await _context.Business
                .FirstOrDefaultAsync(b => b.BusinessName == updateBusinessDto.BusinessName);

            if (business == null)
            {
                return NotFound(new { Message = "Business not found." });
            }

            // Update the business properties if the provided value is not null
            business.BusinessName = updateBusinessDto.BusinessName ?? business.BusinessName;
            business.BusinessAddress = updateBusinessDto.BusinessAddress ?? business.BusinessAddress;
            business.BusinessPostalCode = updateBusinessDto.BusinessPostalCode ?? business.BusinessPostalCode;

            await _context.SaveChangesAsync();

            return Ok(business);
        }
    }
}
