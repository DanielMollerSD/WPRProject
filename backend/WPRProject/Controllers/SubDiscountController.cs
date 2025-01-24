using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WPRProject.Tables;
using Microsoft.AspNetCore.Authorization;

namespace WPRProject.Controllers

{

    [Route("api/[controller]")]
    [ApiController]
    public class SubDiscountController: ControllerBase
    {

        private readonly CarsAndAllContext _context;

        public SubDiscountController(CarsAndAllContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Backoffice, Wagenparkbeheerder")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SubscriptionDiscount>>> GetEmployees()
        {

            var discounts = await _context.SubscriptionDiscount.ToListAsync();
            return Ok(discounts);
        }

        [Authorize(Roles = "Backoffice, Wagenparkbeheerder")]
        [HttpGet("{Id}")]
        public async Task<ActionResult<SubscriptionDiscount>> GetOneDiscount(int id)
        {

            var discount = await _context.SubscriptionDiscount.FindAsync(id);

            if (discount == null)
            {

                return NotFound();
            }

            return discount;
        }
    }
}
