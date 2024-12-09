using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WPRProject.Tables;

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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
        {

            var employees = await _context.Employee.ToListAsync();
            return Ok(employees);
        }
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
    }
}
