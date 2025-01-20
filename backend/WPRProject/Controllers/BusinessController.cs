using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WPRProject.Tables;
using WPRProject.DTOS;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System.Security.Cryptography;
using System.Text;
using BCrypt.Net;

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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Business>>> GetAllBusinesses()
        {
            var businesses = await _context.Business.ToListAsync();
            return Ok(businesses);
        }

        [HttpGet("{Id}")]
        public async Task<ActionResult<Business>> GetBusinessById(int id)
        {
            var business = await _context.Business.FindAsync(id);

            if (business == null)
            {
                return NotFound();
            }

            return business;
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBusinessAccount(int id)
        {
            var businessAccount = await _context.Business.FindAsync(id);
            if (businessAccount == null)
            {
                return NotFound(new { message = "Account not found" });
            }

            _context.Business.Remove(businessAccount);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Account deleted successfully" });
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] BusinessRegisterDto registerDto)
        {
            try
            {
                // Check if KvK already exists
                var existingBusiness = await _context.Business
                    .FirstOrDefaultAsync(c => c.Kvk == registerDto.Kvk);

                if (existingBusiness != null)
                {
                    return BadRequest(new { message = "Kvk is al in gebruik" });
                }

                if (registerDto.businessEmployee == null)
                {
                    return BadRequest(new { message = "Business employee data is missing." });
                }

                // Hash passwords
                var employeePassword = BCrypt.Net.BCrypt.HashPassword(registerDto.businessEmployee.Password);

                // Create the business employee
                var newBusinessEmployee = new BusinessEmployee
                {
                    FirstName = registerDto.businessEmployee.FirstName,
                    LastName = registerDto.businessEmployee.LastName,
                    TussenVoegsel = registerDto.businessEmployee.TussenVoegsel,
                    Email = registerDto.businessEmployee.Email,
                    Password = employeePassword,
                    Role = registerDto.businessEmployee.Role
                };

                // Create the business
                var newBusiness = new Business
                {
                    BusinessName = registerDto.BusinessName,
                    BusinessAddress = registerDto.BusinessAddress,
                    Kvk = registerDto.Kvk,
                    BusinessPostalCode = registerDto.BusinessPostalCode,
                };

                Console.WriteLine($"Received Business Employee: {registerDto.businessEmployee}");
                _context.Business.Add(newBusiness);
                _context.Customer.Add(newBusinessEmployee);
                await _context.SaveChangesAsync();

                return Ok(new { business = newBusiness, employee = newBusinessEmployee });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", details = ex.Message });
            }
        }

    }
}
