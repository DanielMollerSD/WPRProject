using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WPRProject.Tables;

namespace WPRProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehicleController : ControllerBase
    {
        private readonly CarsAndAllContext _context;

        public VehicleController(CarsAndAllContext context)
        {
            _context = context;
        }

        //Fetch alle voertuigen
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Vehicle>>> GetVehicles(
            [FromQuery] string? vehicleType,
            [FromQuery] string? brand,
            [FromQuery] double? minPrice,
            [FromQuery] double? maxPrice,
            [FromQuery] DateTime? startDate,
            [FromQuery] DateTime? endDate)
        {
            var query = _context.Vehicle.AsQueryable();

            if (!string.IsNullOrEmpty(vehicleType) && vehicleType != "all")
            {
                query = query.Where(v => v.VehicleType == vehicleType);
            }

            if (!string.IsNullOrEmpty(brand) && brand != "all")
            {
                query = query.Where(v => v.Brand == brand);
            }

            if (minPrice.HasValue)
            {
                query = query.Where(v => v.Price >= minPrice);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(v => v.Price <= maxPrice);
            }

            if (startDate.HasValue && endDate.HasValue)
            {
                query = query.Where(v => !_context.Rent
                    .Any(r => r.VehicleId == v.Id &&
                             ((r.StartDate >= startDate && r.StartDate <= endDate) ||
                              (r.EndDate >= startDate && r.EndDate <= endDate) ||
                              (r.StartDate <= startDate && r.EndDate >= endDate))));
            }

            var userRole = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
            if (userRole == "Medewerker")
            {
                query = query.Where(v => v.VehicleType == "Car");
            }

            var vehicles = await query.ToListAsync();
            return Ok(vehicles);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<VehicleWithUnavailableDatesDto>> GetVehicleById(int id)
        {
            var vehicle = await _context.Vehicle.FindAsync(id);
            if (vehicle == null)
            {
                return NotFound();
            }

            // Make a list of unavaiable dates for the date picker
            var rentals = await _context.Rent
                .Where(r => r.VehicleId == id)
                .ToListAsync();

            var unavailableDates = new List<string>();
            foreach (var rental in rentals)
            {
                var startDate = rental.StartDate.Date;
                var endDate = rental.EndDate.Date;

                for (var date = startDate; date <= endDate; date = date.AddDays(1))
                {
                    unavailableDates.Add(date.ToString("yyyy-MM-dd"));
                }
            }

            var vehicleDto = new VehicleWithUnavailableDatesDto
            {
                Id = vehicle.Id,
                LicensePlate = vehicle.LicensePlate,
                Brand = vehicle.Brand,
                Model = vehicle.Model,
                Color = vehicle.Color,
                Status = vehicle.Status,
                Note = vehicle.Note,
                Price = vehicle.Price,
                PurchaseYear = vehicle.PurchaseYear,
                VehicleType = vehicle.VehicleType,
                UnavailableDates = unavailableDates
            };

            return Ok(vehicleDto);
        }

        // POST: api/vehicle (Create)
        [Authorize(Roles = "Backoffice")]
        [HttpPost]
        public async Task<ActionResult<Vehicle>> CreateVehicle(Vehicle vehicle)
        {
            if (_context.Vehicle == null)
            {
                return Problem("Entity set 'CarsAndAllContext.Vehicle' is null.");
            }

            _context.Vehicle.Add(vehicle);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetVehicleById", new { id = vehicle.Id }, vehicle);
        }

        // PUT: api/vehicle/{id} (Update)
        [Authorize(Roles = "Backoffice")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVehicle(int id, Vehicle vehicle)
        {
            if (id != vehicle.Id)
            {
                return BadRequest();
            }

            _context.Entry(vehicle).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Vehicle.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/vehicle/{id} (Delete)
        [Authorize(Roles = "Backoffice")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVehicle(int id)
        {
            var vehicle = await _context.Vehicle.FindAsync(id);
            if (vehicle == null)
            {
                return NotFound();
            }

            _context.Vehicle.Remove(vehicle);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize(Roles = "Frontoffice")]
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateVehicleStatus(int id, [FromBody] string newStatus)
        {
            var existingVehicle = await _context.Vehicle.FindAsync(id);
            if (existingVehicle == null)
            {
                return NotFound($"Vehicle with ID {id} not found.");
            }

            existingVehicle.Status = newStatus;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

            return NoContent();
        }

        [Authorize(Roles = "Frontoffice")]
        [HttpPatch("{id}/note")]
        public async Task<IActionResult> UpdateVehicleNote(int id, [FromBody] string newNote)
        {
            var existingVehicle = await _context.Vehicle.FindAsync(id);
            if (existingVehicle == null)
            {
                return NotFound($"Vehicle with ID {id} not found.");
            }

            existingVehicle.Note = newNote;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

            return NoContent();
        }

    }
}
