using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WPRProject.Tables;
using System.Threading.Tasks;

namespace WPRProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RentController : ControllerBase
    {
        private readonly CarsAndAllContext _context;
        private readonly EmailService _emailService;

        public RentController(CarsAndAllContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
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

                var subject = "Rental Confirmation";
                var message = $"<h1>Your rental has been confirmed</h1>" +
                              $"<p>Vehicle: {vehicle.Model}</p>" +
                              $"<p>Rental Period: {rent.StartDate:yyyy-MM-dd} to {rent.EndDate:yyyy-MM-dd}</p>";

                // TODO: Change email adress later!!!
                await _emailService.SendEmailAsync("daniel.moller2003@gmail.com", subject, message);

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
        [HttpPut("{id}/verify")]
        public async Task<IActionResult> UpdateVerificationStatus(int id, [FromBody] bool isApproved)
        {
            var rent = await _context.Rent.FindAsync(id);

            if (rent == null)
            {
                return NotFound();
            }

            rent.Verified = isApproved; 
            await _context.SaveChangesAsync(); 

            return Ok(rent); 
        }

    }
}
