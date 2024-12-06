using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WPRProject.Tables;

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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Damage>>> GetEmployees()
        {

            var damages = await _context.Damage.ToListAsync();
            return Ok(damages);
        }
        [HttpGet("{Id}")]
        public async Task<ActionResult<Damage>> GetOneEmployee(int id)
        {

            var damage = await _context.Damage.FindAsync(id);

            if (damage == null)
            {

                return NotFound();
            }

            return damage;
        }
    }
}
