using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WPRProject.Tables;

namespace WPRProject.Controllers

{
    [Route("api/[controller]")]
    [ApiController]
    public class SubOrderontroller : ControllerBase
    {

        private readonly CarsAndAllContext _context;

        public SubOrderontroller(CarsAndAllContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SubscriptionOrder>>> GetOrder()
        {

            var orders = await _context.Employee.ToListAsync();
            return Ok(orders);
        }
        [HttpGet("{Id}")]
        public async Task<ActionResult<SubscriptionOrder>> GetOneOrder(int id)
        {

            var order = await _context.SubscriptionOrder.FindAsync(id);

            if (order == null)
            {

                return NotFound();
            }

            return order;
        }
    }
}
