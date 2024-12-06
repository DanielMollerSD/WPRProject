using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WPRProject.Tables;

namespace WPRProject.Controllers

{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {

        private readonly CarsAndAllContext _context;

        public CustomerController(CarsAndAllContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
        {

            var customers = await _context.Customer.ToListAsync();
            return Ok(customers);
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
    }
}
