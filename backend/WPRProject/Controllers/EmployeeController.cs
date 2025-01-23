using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WPRProject.Tables;
using WPRProject.DTOS;
using Microsoft.AspNetCore.Authorization;


namespace WPRProject.Controllers

{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {

        private readonly CarsAndAllContext _context;

        public EmployeeController(CarsAndAllContext context)
        {
            _context = context;
        }


        [Authorize(Roles = "Backoffice")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
        {

            var employees = await _context.Employee.ToListAsync();
            return Ok(employees);
        }
         [Authorize(Roles = "Owner, Wagenparkbeheerder")]
        [HttpGet("{Id}")]
        public async Task<ActionResult<Employee>> GetOneEmployee(int id)
        {

            var employee = await _context.Employee.FindAsync(id);

            if (employee == null)
            {

                return NotFound();
            }

            return employee;
        }
        [Authorize(Roles = "Owner, Wagenparkbeheerder")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFrontoficeAccount(int id)
        {
            var account = await _context.Employee.FindAsync(id);
            if (account == null)
            {
                return NotFound(new { message = "Account not found" });
            }
            _context.Employee.Remove(account);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Account deleted successfully" });
        }
        [Authorize(Roles = "Owner, Wagenparkbeheerder")]
        [HttpPost("register-carsandall")]
        public async Task<IActionResult> Register([FromBody] EmployeeRegisterDto registerDto)
        {
            try
            {
                var existingEmployee = await _context.Employee
                    .FirstOrDefaultAsync(c => c.Email == registerDto.Email);

                if (existingEmployee != null)
                {
                    return BadRequest(new { message = "Email is al in gebruik" });
                }

                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

                var newEmployee = new Employee
                {
                    Email = registerDto.Email,
                    Password = hashedPassword,
                    Role = registerDto.Role
                };

                _context.Employee.Add(newEmployee);
                await _context.SaveChangesAsync();

                return Ok(new { employee = newEmployee }); 
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", details = ex.Message });
            }
        }
    }
}
