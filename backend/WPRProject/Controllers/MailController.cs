using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WPRProject.Tables;

namespace WPRProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MailController : ControllerBase
    {
        private readonly CarsAndAllContext _context;

        public MailController(CarsAndAllContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Mail>>> GetAllMails()
        {
            var mails = await _context.Mail.ToListAsync();
            return Ok(mails);
        }

        [HttpGet("{Id}")]
        public async Task<ActionResult<Mail>> GetMailById(int id)
        {
            var mail = await _context.Mail.FindAsync(id);

            if (mail == null)
            {
                return NotFound();
            }

            return mail;
        }
    }
}
