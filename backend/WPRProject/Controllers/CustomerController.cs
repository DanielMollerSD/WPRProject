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
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCustomer(int id, Customer customer)
    {
        if (id != customer.Id)
        {
            return BadRequest("Customer ID mismatch.");
        }

        _context.Entry(customer).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Customer.Any(e => e.Id == id))
            {
                return NotFound("Customer not found.");
            }

            throw;
        }

        return NoContent();
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



    }
}
