using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using WPRProject.Tables;
using System.Threading.Tasks;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using WPRProject.DTOS;
using Microsoft.Extensions.Logging;

namespace WPRProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RentController : ControllerBase
    {
        private readonly CarsAndAllContext _context;
        private readonly ILogger<RentController> _logger;
        private readonly EmailService _emailService;

        public RentController(CarsAndAllContext context, ILogger<RentController> logger, EmailService emailService)
        {
            _context = context;
            _logger = logger;
            _emailService = emailService;
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
                var subject = "Huur bevestiging - CarsAndAll";
                var message = $"<h1>Uw huur is bevestigd!</h1>" +
                              $"<p>Voertuig: {vehicle.Brand} {vehicle.Model}</p>" +
                              $"<p>Huur periode: {rent.StartDate:yyyy-MM-dd} tot {rent.EndDate:yyyy-MM-dd}</p>";

                await _emailService.SendEmailAsync(userEmail, subject, message);

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
[Authorize(Roles = "Wagenparkbeheerder")]
[HttpGet("businessrents")]
public async Task<ActionResult<IEnumerable<object>>> GetRentsForBusiness([FromQuery] int? businessId = null)
{
    try
    {
        // Gebruik BusinessId uit querystring als deze is meegegeven
        if (!businessId.HasValue)
        {
            // Haal het e-mailadres van de ingelogde gebruiker op
            var userEmail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized("User is not authenticated.");
            }

            // Zoek de gebruiker in de database
            var user = await _context.BusinessEmployee
                                      .FirstOrDefaultAsync(e => e.Email == userEmail);
            if (user == null)
            {
                return Unauthorized("User not found in the system.");
            }

            // Haal het businessId van de ingelogde gebruiker
            businessId = user.BusinessId;
        }

        // Controleer of het businessId geldig is
        var businessExists = await _context.Business
                                           .AnyAsync(b => b.BusinessId == businessId);
        if (!businessExists)
        {
            return NotFound("Business not found.");
        }

        // Haal de werknemers op die horen bij het opgegeven bedrijf
        var employeeIds = await _context.BusinessEmployee
            .Where(be => be.BusinessId == businessId)
            .Select(be => be.Id)
            .ToListAsync();

        // Haal de huurovereenkomsten op die horen bij de werknemers
        var rents = await _context.Rent
            .Include(r => r.Vehicle) // Optioneel: voeg voertuiggegevens toe
            .Include(r => r.Customer) // Optioneel: voeg klantgegevens toe
            .Where(r => r.CustomerId != null && employeeIds.Contains(r.CustomerId))
            .Select(r => new
            {
                r.Id,
                r.StartDate,
                r.EndDate,
                r.TravelPurpose,
                r.FurthestDestination,
                r.ExpectedDistance,
                Vehicle = new
                {
                    r.Vehicle.Id,
                    r.Vehicle.Brand,
                    r.Vehicle.Model
                },
                Customer = new
                {
                    Name = $"{r.Customer.FirstName} {r.Customer.TussenVoegsel ?? ""} {r.Customer.LastName}".Trim(),
                    r.Customer.Email
                },
                r.Status
            })
            .ToListAsync();

        // Controleer of er huurovereenkomsten gevonden zijn
        if (!rents.Any())
        {
            return NotFound("No rents found for the specified business.");
        }

        return Ok(rents);
    }
    catch (Exception ex)
    {
        // Log de fout met gedetailleerde foutinformatie
        _logger.LogError(ex, "Error fetching rents for business.");
        return StatusCode(500, $"An error occurred while processing your request: {ex.Message}");
    }
}


[HttpGet("Individual")]
public async Task<ActionResult<IEnumerable<object>>> GetRentsForCustomer([FromQuery] int? customerId = null)
{
    try
    {
        // Gebruik CustomerId uit querystring als deze is meegegeven
        if (!customerId.HasValue)
        {
            // Haal het e-mailadres van de ingelogde gebruiker op
            var userEmail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized("User is not authenticated.");
            }

            // Zoek de gebruiker in de database
            var customer = await _context.Customer
                                          .FirstOrDefaultAsync(c => c.Email == userEmail);
            if (customer == null)
            {
                return Unauthorized("User not found in the system.");
            }

            // Haal het customerId van de ingelogde gebruiker
            customerId = customer.Id;
        }

        // Controleer of het customerId geldig is
        var customerExists = await _context.Customer
                                           .AnyAsync(c => c.Id == customerId);
        if (!customerExists)
        {
            return NotFound("Customer not found.");
        }

        // Haal de huurovereenkomsten op die horen bij de klant
        var rents = await _context.Rent
            .Include(r => r.Vehicle) // Optioneel: voeg voertuiggegevens toe
            .Where(r => r.CustomerId == customerId)
            .Select(r => new
            {
                r.Id,
                r.StartDate,
                r.EndDate,
                r.TravelPurpose,
                r.FurthestDestination,
                r.ExpectedDistance,
                Vehicle = new
                {
                    r.Vehicle.Id,
                    r.Vehicle.Brand,
                    r.Vehicle.Model
                },
                Customer = new
                {
                    Name = $"{r.Customer.FirstName} {r.Customer.TussenVoegsel ?? ""} {r.Customer.LastName}".Trim(),
                    r.Customer.Email
                },
                r.Status
            })
            .ToListAsync();

        // Controleer of er huurovereenkomsten gevonden zijn
        if (!rents.Any())
        {
            return NotFound("No rents found for the specified customer.");
        }

        return Ok(rents);
    }
    catch (Exception ex)
    {
        // Log de fout met gedetailleerde foutinformatie
        _logger.LogError(ex, "Error fetching rents for customer.");
        return StatusCode(500, $"An error occurred while processing your request: {ex.Message}");
    }
}

    }}