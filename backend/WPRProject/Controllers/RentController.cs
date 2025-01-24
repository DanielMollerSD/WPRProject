using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using WPRProject.Tables;
using System.Threading.Tasks;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using WPRProject.DTOS;

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

        // GET all rents (Authenticated users)
        [Authorize(Roles = "Backoffice, Wagenparkbeheerder, Medewerker, Individual")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Rent>>> GetAllRents()
        {
            var rents = await _context.Rent.Include(r => r.Vehicle).ToListAsync();
            return Ok(rents);
        }

        // GET a specific rent (Authenticated users)
        [Authorize(Roles = "Backoffice, Wagenparkbeheerder, Medewerker, Individual")]
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

        // POST a new rent (Authenticated users)
        [Authorize(Roles = "Individual, Medewerker")]
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

            if (rent.StartDate >= rent.EndDate)
            {
                return BadRequest(new { errors = new { DateRange = "Start date must be before end date." } });
            }

            var userEmail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized(new { Message = "User is not authenticated." });
            }

            var user = await _context.Customer.FirstOrDefaultAsync(e => e.Email == userEmail);

            rent.CustomerId = user.Id;

            try
            {
                rent.Status = Rent.Pending; // Set default status
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

        // PATCH rent status (Authenticated users)
        [Authorize(Roles = "Backoffice")]
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string newStatus)
        {
            if (string.IsNullOrWhiteSpace(newStatus))
            {
                return BadRequest("Status cannot be empty.");
            }

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

        [Authorize(Roles = "Backoffice, Wagenparkbeheerder, Medewerker, Individual")]
        [HttpGet("requests")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllRentRequests()
        {
            // Include both Vehicle and Customer
            var rents = await _context.Rent
                .Include(r => r.Vehicle)
                .Include(r => r.Customer)
                .ToListAsync();

            if (rents == null)
            {
                return NotFound();
            }

            var rentRequests = rents.Select(rent => new
            {
                rent.Id,
                rent.StartDate,
                rent.EndDate,
                rent.TravelPurpose,
                rent.FurthestDestination,
                rent.ExpectedDistance,
                Vehicle = rent.Vehicle,
                Customer = rent.Customer switch
                {
                    Individual individual => new RentRequestsDto
                    {
                        FirstName = individual.FirstName,
                        LastName = individual.LastName,
                        Email = individual.Email,
                        PhoneNumber = individual.PhoneNumber,
                        Address = individual.Address
                    },
                    BusinessEmployee businessEmployee => new RentRequestsDto
                    {
                        FirstName = businessEmployee.FirstName,
                        LastName = businessEmployee.LastName,
                        Email = businessEmployee.Email,
                    },
                    _ => null
                },
                TotalPrice = rent.Vehicle != null && rent.StartDate != default && rent.EndDate != default
                ? (rent.EndDate - rent.StartDate).Days * rent.Vehicle.Price : 0,
                rent.Status,
            }).ToList();

            return Ok(rentRequests);
        }
    }
}
