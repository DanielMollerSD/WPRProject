using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Vehicle>>> GetVehicles(
            [FromQuery] string? vehicleType,
            [FromQuery] string? brand,
            [FromQuery] double? minPrice,
            [FromQuery] double? maxPrice,
            [FromQuery] string? userType,
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

            if (!string.IsNullOrEmpty(userType))
            {
                // Apply user-specific filters here based on `userType`
            }
            var vehicles = await query.ToListAsync();
            return Ok(vehicles);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Vehicle>> GetVehicleById(int id)
        {
            var vehicle = await _context.Vehicle.FindAsync(id);

            if (vehicle == null)
            {
                return NotFound();
            }

            return Ok(vehicle);
        }
    }
}
