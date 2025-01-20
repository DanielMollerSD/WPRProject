using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WPRProject.Tables;

namespace WPRProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubOrderController : ControllerBase
    {
        private readonly CarsAndAllContext _context;

        public SubOrderController(CarsAndAllContext context)
        {
            _context = context;
        }

        // GET: api/SubOrder
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SubscriptionOrder>>> GetOrders()
        {
            var orders = await _context.SubscriptionOrder
                                       .Include(o => o.Business)
                                       .Include(o => o.Subscription)
                                       .ToListAsync();
            return Ok(orders);
        }

        // GET: api/SubOrder/{Id}
        [HttpGet("{Id}")]
        public async Task<ActionResult<SubscriptionOrder>> GetOrder(int id)
        {
            var order = await _context.SubscriptionOrder
                                      .Include(o => o.Business)
                                      .Include(o => o.Subscription)
                                      .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return NotFound();

            return order;
        }

        // POST: api/SubOrder
        [HttpPost]
        public async Task<ActionResult<SubscriptionOrder>> CreateOrder(SubscriptionOrder order)
        {
            if (!_context.Business.Any(b => b.BusinessId == order.BusinessId))
                return BadRequest("Invalid BusinessId.");

            if (!_context.Subscription.Any(s => s.Id == order.SubscriptionId))
                return BadRequest("Invalid SubscriptionId.");

            _context.SubscriptionOrder.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }
    }
}
