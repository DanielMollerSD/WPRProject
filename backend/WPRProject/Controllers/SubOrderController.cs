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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetOrders()
        {
            // Return orders with business and subscription info
            var orders = await _context.SubscriptionOrder
                .Include(o => o.Business)
                .Include(o => o.Subscription)
                .Select(o => new
                {
                    o.Id,
                    o.Business.BusinessName,
                    o.BusinessId,
                    SubscriptionName = o.Subscription.Name,
                    o.Status
                })
                .ToListAsync();

            return Ok(orders);
        }

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

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateSubscriptionOrder([FromBody] SubscriptionOrder order)
        {
            var userEmail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized(new { Message = "User is not authenticated." });
            }

            var user = await _context.BusinessEmployee.FirstOrDefaultAsync(e => e.Email == userEmail);
            order.BusinessId = user.BusinessId;

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var existingApprovedOrder = await _context.SubscriptionOrder
                    .Where(o => o.BusinessId == user.BusinessId && o.Status == "Approved")
                    .FirstOrDefaultAsync();

                if (existingApprovedOrder != null)
                    {
                        if (existingApprovedOrder.SubscriptionId == order.SubscriptionId)
                        {
                            return BadRequest(new { Message = "An approved subscription already exists for the same subscription. You cannot create a new order." });
                        }
                        else
                        {
                            _context.SubscriptionOrder.Remove(existingApprovedOrder);
                        }
                    }

                var existingOrder = await _context.SubscriptionOrder
                    .Where(o => o.BusinessId == user.BusinessId && o.Status == "Pending")
                    .FirstOrDefaultAsync();

                if (existingOrder != null)
                {
                    _context.SubscriptionOrder.Remove(existingOrder);
                }

                // Set the new order status to Active
                order.Status = "Pending";
                _context.SubscriptionOrder.Add(order);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", details = ex.Message });
            }
        }
    
    
        [HttpPatch("{id}/approve")]
        public async Task<IActionResult> ApproveOrder(int id)
        {
            var order = await _context.SubscriptionOrder.FindAsync(id);

            if (order == null)
            {
                return NotFound(new { message = "Order not found." });
            }

            order.Status = "Approved";

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Order approved successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while approving the order.",
                    details = ex.Message
                });
            }
        }

        [HttpPatch("{id}/decline")]
        public async Task<IActionResult> DeclineOrder(int id)
        {
            var order = await _context.SubscriptionOrder.FindAsync(id);

            if (order == null)
            {
                return NotFound(new { message = "Order not found." });
            }

            order.Status = "Declined";

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Order declined successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while declining the order.",
                    details = ex.Message
                });
            }
        }

        [Authorize]
        [HttpDelete("delete-active")]
        public async Task<IActionResult> DeleteActiveSubscription()
        {
            var userEmail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized(new { Message = "User is not authenticated." });
            }

            var user = await _context.BusinessEmployee.FirstOrDefaultAsync(e => e.Email == userEmail);
            if (user == null)
            {
                return NotFound(new { Message = "User not found." });
            }

            var existingOrder = await _context.SubscriptionOrder
                .Where(o => o.BusinessId == user.BusinessId && (o.Status == "Pending" || o.Status == "Approved"))
                .FirstOrDefaultAsync();

            if (existingOrder == null)
            {
                return NotFound(new { Message = "No active subscription found." });
            }

            _context.SubscriptionOrder.Remove(existingOrder);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}
