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

        private readonly EmailService _emailService;

        public SubOrderController(CarsAndAllContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        [Authorize(Roles = "Backoffice, Wagenparkbeheerder")]
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

        [Authorize(Roles = "Backoffice, Wagenparkbeheerder")]
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

        [Authorize(Roles = "Wagenparkbeheerder")]
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

                var subject = "Abonnement bevestiging - CarsAndAll";
                var subscriptionName = await _context.Subscription
                    .Where(s => s.Id == order.SubscriptionId)
                    .Select(s => s.Name)
                    .FirstOrDefaultAsync();

                if (string.IsNullOrEmpty(subscriptionName))
                {
                    return BadRequest(new { Message = "Invalid subscription ID." });
                }

                //email for subscription confirmation
                // var message = $"<h1>Uw abonnement is bevestigd!</h1>" +
                //             $"<p>Abonnement: {subscriptionName}</p>" +
                //             $"<p>Periode: {order.StartDate:yyyy-MM-dd} tot {order.EndDate:yyyy-MM-dd}</p>";

                // await _emailService.SendEmailAsync(userEmail, subject, message);


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
    
        [Authorize(Roles = "Backoffice")]
        [HttpPatch("{id}/approve")]
        public async Task<IActionResult> ApproveOrder(int id)
        {
            var order = await _context.SubscriptionOrder
                .Include(o => o.Business)
                .Include(o => o.Subscription)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound(new { message = "Order not found." });
            }

            order.Status = "Approved";

            try
            {
                await _context.SaveChangesAsync();

                var userEmail = await _context.BusinessEmployee
                    .Where(e => e.BusinessId == order.BusinessId)
                    .Select(e => e.Email)
                    .FirstOrDefaultAsync();

                if (!string.IsNullOrEmpty(userEmail))
                {
                    var subject = "Abonnement bevestiging - CarsAndAll";
                    var message = $"<h1>Uw abonnement is goedgekeurd!</h1>" +
                                $"<p>Abonnement: {order.Subscription.Name}</p>" +
                                $"<p>Periode: {order.StartDate:yyyy-MM-dd} tot {order.EndDate:yyyy-MM-dd}</p>" +
                                $"<p>Bedankt voor het kiezen van CarsAndAll!</p>";

                    await _emailService.SendEmailAsync(userEmail, subject, message);
                }

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

        [Authorize(Roles = "Backoffice")]
        [HttpPatch("{id}/decline")]
        public async Task<IActionResult> DeclineOrder(int id)
        {
            var order = await _context.SubscriptionOrder
                .Include(o => o.Business)
                .Include(o => o.Subscription)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound(new { message = "Order not found." });
            }

            order.Status = "Declined";

            try
            {
                await _context.SaveChangesAsync();

                var userEmail = await _context.BusinessEmployee
                    .Where(e => e.BusinessId == order.BusinessId)
                    .Select(e => e.Email)
                    .FirstOrDefaultAsync();

                if (!string.IsNullOrEmpty(userEmail))
                {
                    var subject = "Abonnement afgewezen - CarsAndAll";
                    var message = $"<h1>Uw abonnement is afgewezen!</h1>" +
                                $"<p>Abonnement: {order.Subscription.Name}</p>" +
                                $"<p>Bedankt voor het kiezen van CarsAndAll!</p>";

                    await _emailService.SendEmailAsync(userEmail, subject, message);
                }

                return Ok(new { message = "Order declined." });
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

        [Authorize(Roles = "Wagenparkbeheerder")]
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
