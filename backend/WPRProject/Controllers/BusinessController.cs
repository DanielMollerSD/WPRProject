using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WPRProject.Tables;

namespace WPRProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BusinessController : ControllerBase
    {
        private readonly CarsAndAllContext _context;

        public BusinessController(CarsAndAllContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Business>>> GetAllBusinesses()
        {
            var businesses = await _context.Business.ToListAsync();
            return Ok(businesses);
        }

        [HttpGet("{Id}")]
        public async Task<ActionResult<Business>> GetBusinessById(int id)
        {
            var business = await _context.Business.FindAsync(id);

            if (business == null)
            {
                return NotFound();
            }

            return business;
        }
    }
}
