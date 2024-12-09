using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WPRProject.Tables;

namespace WPRProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RentController : ControllerBase
    {
        private readonly CarsAndAllContext _context;

        public RentController(CarsAndAllContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Rent>>> GetAllRents()
        {
            var rents = await _context.Rent.ToListAsync();
            return Ok(rents);
        }

        [HttpGet("{Id}")]
        public async Task<ActionResult<Rent>> GetRentById(int id)
        {
            var rent = await _context.Rent.FindAsync(id);

            if (rent == null)
            {
                return NotFound();
            }

            return rent;
        }
    }
}
