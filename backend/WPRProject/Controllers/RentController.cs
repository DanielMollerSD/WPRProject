using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WPRProject.Tables;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Serilog;
using System.Threading.Tasks;

namespace WPRProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RentController : ControllerBase
    {
        private readonly CarsAndAllContext _context;
        private readonly EmailService _emailService;
        private readonly ILogger<RentController> _logger;

        public RentController(CarsAndAllContext context, EmailService emailService, ILogger<RentController> logger)
        {
            _context = context;
            _emailService = emailService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Rent>>> GetAllRents()
        {
            var rents = await _context.Rent.Include(r => r.Vehicle).ToListAsync();
            return Ok(rents);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRent(int id)
        {
             _logger.LogInformation("GetRent method called for RentId {RentId}", id);
            var rent = await _context.Rent.FindAsync(id);
            if (rent == null)
            {
                _logger.LogWarning("Rent with ID {RentId} not found", id);
                return NotFound();
            }
            _logger.LogInformation("Rent record with ID {RentId} retrieved successfully", id);
            return Ok(rent);
        }

        [HttpPost]
        public async Task<IActionResult> CreateRent([FromBody] Rent rent)
        {
            _logger.LogInformation("CreateRent method called for VehicleId {VehicleId}", rent.VehicleId);

            var userEmail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized(new { Message = "User is not authenticated." });
            }

            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid ModelState in CreateRent");
                return BadRequest(ModelState);
            }

            var vehicle = await _context.Vehicle.FindAsync(rent.VehicleId);
            if (vehicle == null)
            {
                _logger.LogWarning("Vehicle with ID {VehicleId} not found", rent.VehicleId);
                return BadRequest(new { errors = new { VehicleId = "The specified vehicle does not exist." } });
            }

            var isRented = await _context.Rent.AnyAsync(r =>
                r.VehicleId == rent.VehicleId &&
                r.EndDate >= rent.StartDate &&
                r.StartDate <= rent.EndDate);

            if (isRented)
            {
                _logger.LogInformation("Vehicle with ID {VehicleId} is already rented for the specified period", rent.VehicleId);
                return Conflict("The vehicle is already rented for the specified period.");
            }

            try
            {
                rent.Status = Rent.Pending; // Set default status
                _context.Rent.Add(rent);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Successfully created rent entry for VehicleId {VehicleId}, RentId {RentId}", rent.VehicleId, rent.Id);

                var subject = "Rental Confirmation";
                var message = $"<h1>Your rental has been confirmed</h1>" +
                              $"<p>Vehicle: {vehicle.Model}</p>" +
                              $"<p>Rental Period: {rent.StartDate:yyyy-MM-dd} to {rent.EndDate:yyyy-MM-dd}</p>";

                // TODO: Change email adress later!!!
                await _emailService.SendEmailAsync(userEmail, subject, message);

                _logger.LogInformation("Rental confirmation email sent for RentId {RentId}", rent.Id);
                return CreatedAtAction("GetRent", new { id = rent.Id }, rent);
            }
            catch (Exception ex)
            {
                 _logger.LogError(ex, "An error occurred while creating the rent entry for VehicleId {VehicleId}", rent.VehicleId);
                return StatusCode(500, new
                {
                    message = "An error occurred while creating the rent entry.",
                    details = ex.Message
                });
            }
        }

        [HttpPatch("{id}/status")]
public async Task<IActionResult> UpdateStatus(int id, [FromBody] string newStatus)
{
    var rent = await _context.Rent.FindAsync(id);

    if (rent == null)
    {
        return NotFound();
    }

    // Validate the new status value
    if (newStatus != Rent.Pending && newStatus != Rent.Accepted && newStatus != Rent.Declined)
    {
        return BadRequest("Invalid status value. Allowed values are: 'pending', 'accepted', 'declined'.");
    }

    rent.Status = newStatus;
    await _context.SaveChangesAsync();

    return Ok(rent);
}
    }
}
