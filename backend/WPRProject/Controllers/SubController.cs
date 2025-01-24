using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WPRProject.Tables;
using Microsoft.AspNetCore.Authorization;

namespace WPRProject.Controllers

{
    [Route("api/[controller]")]
    [ApiController]
    public class SubController : ControllerBase
    {

        private readonly CarsAndAllContext _context;

        public SubController(CarsAndAllContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Backoffice, Wagenparkbeheerder")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Subscription>>> GetSubscriptions()
        {

            var subscriptions = await _context.Subscription.ToListAsync();
            return Ok(subscriptions);
        }

        [Authorize(Roles = "Backoffice, Wagenparkbeheerder")]
        [HttpGet("{Id}")]
        public async Task<ActionResult<Subscription>> GetOneSubscription(int id)
        {

            var subscription = await _context.Subscription.FindAsync(id);

            if (subscription == null)
            {

                return NotFound();
            }

            return subscription;
        }
    }
}
