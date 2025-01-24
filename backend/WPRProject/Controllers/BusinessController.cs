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
using WPRProject.Utilities;
using System.IdentityModel.Tokens.Jwt;


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
                .Where(b => b.BusinessEmployees.Any(e => e.Email == userEmail))
                .FirstOrDefaultAsync();

            if (business == null)
            {
                return NotFound(new { Message = "Business not found for this user." });
            }

            return Ok(business);
        }

        // Get all employees of the business
        [Authorize(Roles = "Owner, Wagenparkbeheerder")]
        [HttpGet("employees")]
        public async Task<IActionResult> GetEmployees()
        {
            var userEmail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized("User not authenticated.");
            }

            var business = await _context.Business
                .Include(b => b.BusinessEmployees)
                .FirstOrDefaultAsync(b => b.BusinessEmployees.Any(e => e.Email == userEmail));

            if (business == null)
            {
                return NotFound("No business found for the logged-in user.");
            }

            var employees = business.BusinessEmployees;

            if (employees == null || !employees.Any())
            {
                return NotFound("No employees found for this business.");
            }

            return Ok(new { employees = employees });
        }

         // Get business by ID
        [Authorize (Roles = "Owner, Wagenparkbeheerder")]
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
        [Authorize (Roles = "Owner, Wagenparkbeheerder")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBusinessAccount(int id)
        {
            var businessAccount = await _context.Customer.FindAsync(id);
            if (businessAccount == null)
            {
                return NotFound(new { Message = "Business account not found." });
            }

            _context.Customer.Remove(businessAccount);
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

        [Authorize (Roles = "Owner, Wagenparkbeheerder")]
        [HttpPost("register-employee")]
        public async Task<IActionResult> Register([FromBody] BusinessEmployeeRegisterDto registerDto)
        {
            if (registerDto == null)
            {
                return BadRequest(new { Message = "Business employee data is missing." });
            }

            try
            {
                // Extract JWT token from the "access_token" cookie
                var token = Request.Cookies["access_token"];
                
                if (string.IsNullOrEmpty(token))
                {
                    return Unauthorized(new { Message = "Authentication token is missing." });
                }

                // Decode the token and extract the BusinessId from claims
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = tokenHandler.ReadJwtToken(token);

                var businessIdClaim = jwtToken?.Claims?.FirstOrDefault(c => c.Type == "BusinessId");

                if (businessIdClaim == null)
                {
                    return Unauthorized(new { Message = "BusinessId not found in the token." });
                }

                // Convert the BusinessId from string to int (or whatever type it is)
                var businessId = int.Parse(businessIdClaim.Value);

                // Hash employee password
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

                // Create the business employee
                var newBusinessEmployee = new BusinessEmployee
                {
                    FirstName = registerDto.FirstName,
                    LastName = registerDto.LastName,
                    TussenVoegsel = registerDto.TussenVoegsel,
                    Email = registerDto.Email,
                    Password = hashedPassword,
                    Role = registerDto.Role,
                    BusinessId = businessId // Use the BusinessId extracted from the token
                };

                // Add the new business employee to the context
                _context.Customer.Add(newBusinessEmployee);
                await _context.SaveChangesAsync();

                return Ok(new { Employee = newBusinessEmployee });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", details = ex.Message });
            }
        }
        // Update business details
        [Authorize (Roles = "Owner")]
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

        [Authorize (Roles = "Owner, Wagenparkbeheerder")]
        [HttpPut("updateEmployee/{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromBody] UpdateBusinessAccountDto employeeDto)
        {
            // Fetch the employee by ID from the database
            var employee = await _context.Customer
                .OfType<BusinessEmployee>()  // Assuming BusinessEmployee is a subclass of Customer
                .FirstOrDefaultAsync(e => e.Id == id);  // Ensure you use the correct identifier (CustomerId or whatever field matches)

            if (employee == null)
            {
                return NotFound(new { Message = "Employee not found." });
            }

            // Check if the new email is different and already in use by another account
            if (!string.IsNullOrEmpty(employeeDto.Email) && employeeDto.Email != employee.Email)
            {
                var existingEmail = await _context.Customer
                    .OfType<BusinessEmployee>()
                    .FirstOrDefaultAsync(e => e.Email == employeeDto.Email);

                if (existingEmail != null)
                {
                    return BadRequest(new { Message = "The email is already in use by another account." });
                }
            }

            // Only update the properties that are provided in the DTO
            employee.FirstName = employeeDto.FirstName ?? employee.FirstName;
            employee.LastName = employeeDto.LastName ?? employee.LastName;
            employee.Email = employeeDto.Email ?? employee.Email;
            employee.Role = employeeDto.Role ?? employee.Role;

            // If the password is provided, hash it
            if (!string.IsNullOrEmpty(employeeDto.Password))
            {
                employee.Password = BCrypt.Net.BCrypt.HashPassword(employeeDto.Password);
            }

            // Save the changes to the database
            await _context.SaveChangesAsync();

            // Return the updated employee details
            return Ok(new { Message = "Employee updated successfully", Employee = employee });
        }
        [Authorize(Roles = "Owner")]
        [HttpDelete("delete-business/{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {

            Console.WriteLine("inside controller");    
            var business = await _context.Business.FindAsync(id);
            if (business == null)
            {
                return NotFound();
            }

            _context.Business.Remove(business);
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
