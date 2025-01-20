using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WPRProject.Tables;

namespace WPRProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BusinessEmployeeController : ControllerBase
    {
        private readonly CarsAndAllContext _context;

        public BusinessEmployeeController(CarsAndAllContext context)
        {
            _context = context;
        }

        [HttpGet("business/{employeeId}")]
        public async Task<ActionResult<int>> GetBusinessIdByEmployee(int employeeId)
        {
            var employee = await _context.BusinessEmployee
                .Include(e => e.Business)
                .FirstOrDefaultAsync(e => e.Id == employeeId);

            if (employee == null || employee.Business == null)
                return NotFound("Employee or associated Business not found.");

            return Ok(employee.Business.BusinessId);
        }
    }
}
