using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WPRProject.Tables;

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
    }
}
