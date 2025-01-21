using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using WPRProject.Tables;
using System.Security.Claims;

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
        //[Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateSubscriptionOrder([FromBody] SubscriptionOrder order)
        {

            var userEmail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            Console.WriteLine("e");
            Console.WriteLine(userEmail);
            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized(new { Message = "User is not authenticated." });
            }

            

            // Retrieve the BusinessId from the logged-in user's claims
            var businessIdClaim = User.Claims.FirstOrDefault(c => c.Type == "BusinessId")?.Value;
            Console.WriteLine("a");
            Console.WriteLine(businessIdClaim);
            if (string.IsNullOrEmpty(businessIdClaim))
            {
                return Unauthorized(new { Message = "User is not authenticated or BusinessId claim is missing." });
            }

            if (!int.TryParse(businessIdClaim, out var businessId))
            {
                return BadRequest(new { Message = "Invalid BusinessId claim value." });
            }

            // Set the BusinessId in the order object
            order.BusinessId = businessId;

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                _context.SubscriptionOrder.Add(order);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetSubscriptionOrder", new { id = order.Id }, order);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while creating the subscription order.",
                    details = ex.Message
                });
            }
        }

    }
}
