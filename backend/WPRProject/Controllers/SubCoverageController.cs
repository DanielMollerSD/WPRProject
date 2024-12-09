using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Protocols;
using WPRProject.Tables;

namespace WPRProject.Controllers

{
    [Route("api/[controller]")]
    [ApiController]
    public class SubCoverageController : ControllerBase
    {

        private readonly CarsAndAllContext _context;

        public SubCoverageController(CarsAndAllContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SubscriptionCoverage>>> GetCoverage()
        {

            var coverages = await _context.SubscriptionCoverage.ToListAsync();
            return Ok(coverages);
        }
        [HttpGet("{Id}")]
        public async Task<ActionResult<SubscriptionCoverage>> GetOneCoverage(int id)
        {

            var coverage = await _context.SubscriptionCoverage.FindAsync(id);

            if (coverage == null)
            {

                return NotFound();
            }

            return coverage;
        }
    }
}
