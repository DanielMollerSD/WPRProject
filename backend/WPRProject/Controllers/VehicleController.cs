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
        public async Task<ActionResult<IEnumerable<Vehicle>>> GetVehicles()
        {

            var vehicles = await _context.Vehicles.ToListAsync();
            return Ok(vehicles);
        }
        
    }
}
