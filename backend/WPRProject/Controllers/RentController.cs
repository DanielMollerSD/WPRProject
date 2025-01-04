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


        [HttpGet("{id}")]
        public async Task<IActionResult> GetRent(int id)
        {
            var rent = await _context.Rent.FindAsync(id);
            if (rent == null)
            {
                return NotFound();
            }
            return Ok(rent);
        }


        [HttpPost]
        public async Task<IActionResult> CreateRent([FromBody] Rent rent)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var vehicle = await _context.Vehicle.FindAsync(rent.VehicleId);
            if (vehicle == null)
            {
                return BadRequest(new { errors = new { VehicleId = "The specified vehicle does not exist." } });
            }

            var isRented = await _context.Rent.AnyAsync(r =>
                r.VehicleId == rent.VehicleId &&
                r.EndDate >= rent.StartDate &&
                r.StartDate <= rent.EndDate);

            if (isRented)
            {
                return Conflict("The vehicle is already rented for the specified period.");
            }

            try
            {
                _context.Rent.Add(rent);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetRent", new { id = rent.Id }, rent);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while creating the rent entry.",
                    details = ex.Message
                });
            }
        }

    }
}
