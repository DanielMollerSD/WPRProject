using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WPRProject.Tables;
using Microsoft.AspNetCore.Authorization;

namespace WPRProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrivacyController : ControllerBase
    {
        private readonly CarsAndAllContext _context;

        public PrivacyController(CarsAndAllContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Privacy>>> GetPrivacyItems()
        {
            return await _context.Set<Privacy>().ToListAsync();
        }

        [Authorize(Roles = "Backoffice")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePrivacy(int id, [FromBody] Privacy privacy)
        {
            if (id != privacy.Id)
            {
                return BadRequest("Privacy ID mismatch");
            }

            var existingPrivacy = await _context.Privacy.FindAsync(id);
            if (existingPrivacy == null)
            {
                return NotFound("Privacy not found");
            }

            existingPrivacy.Description = privacy.Description;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(500, "Failed to update the privacy policy");
            }

            return NoContent();
        }

    }
}
