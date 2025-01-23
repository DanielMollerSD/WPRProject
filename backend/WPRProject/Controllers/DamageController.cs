using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WPRProject.Tables;
using Microsoft.AspNetCore.Authorization;

namespace WPRProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DamageController : ControllerBase
    {
        private readonly CarsAndAllContext _context;

        public DamageController(CarsAndAllContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Frontoffice")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Damage>>> GetDamages()
        {
            var damages = await _context.Damage.ToListAsync();
            return Ok(damages);
        }

        [Authorize(Roles = "Backoffice, Frontoffice")]
        [HttpGet("{Id}")]
        public async Task<ActionResult<Damage>> GetOneDamage(int id)
        {
            var damage = await _context.Damage.FindAsync(id);

            if (damage == null)
            {
                return NotFound();
            }

            return damage;
        }

        [Authorize(Roles = "Backoffice, Frontoffice")]
        [HttpGet("vehicle/{vehicleId}")]
        public IActionResult GetDamagesByVehicle(int vehicleId)
        {
            var damages = _context.Damage
                .Where(d => d.VehicleId == vehicleId)
                .ToList();

            if (damages == null || !damages.Any())
            {
                return NotFound(new { Message = "No damages found for this vehicle." });
            }

            return Ok(damages);
        }
       
        [Authorize(Roles = "Frontoffice")]
        [HttpPost]
        public async Task<ActionResult<Damage>> CreateDamage(Damage damage)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Damage.Add(damage);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOneDamage), new { id = damage.Id }, damage);
        }

        [Authorize(Roles = "Backoffice")]
        [HttpPut("{id}/approve")]
        public async Task<IActionResult> ApproveDamage(int id)
        {
            var damage = await _context.Damage.FindAsync(id);

            if (damage == null)
            {
                return NotFound(new { Message = "Damage not found" });
            }

            damage.Status = "Accepted";
            await _context.SaveChangesAsync();

            return Ok(damage);
        }

        [Authorize(Roles = "Backoffice")]
        [HttpPut("{id}/pending")]
        public async Task<IActionResult> SetDamageToPending(int id)
        {
            var damage = await _context.Damage.FindAsync(id);

            if (damage == null)
            {
                return NotFound(new { Message = "Damage not found" });
            }

            damage.Status = "Pending";
            await _context.SaveChangesAsync();

            return Ok(damage);
        }
    }
}
