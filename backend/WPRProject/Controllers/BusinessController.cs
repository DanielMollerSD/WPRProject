using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WPRProject.Tables;
using WPRProject.DTOS;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System.Security.Cryptography;
using System.Text;
using BCrypt.Net;

namespace WPRProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BusinessController : ControllerBase
    {
        private readonly CarsAndAllContext _context;

        public BusinessController(CarsAndAllContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Business>>> GetAllBusinesses()
        {
            var businesses = await _context.Business.ToListAsync();
            return Ok(businesses);
        }

        [HttpGet("{Id}")]
        public async Task<ActionResult<Business>> GetBusinessById(int id)
        {
            var business = await _context.Business.FindAsync(id);

            if (business == null)
            {
                return NotFound();
            }

            return business;
        }

       
      [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] BusinessRegisterDto registerDto)
        {
            if (registerDto == null)
            {
                return BadRequest(new { message = "Invalid data." });
            }

            try
            {
                var existingBusiness = await _context.Business
                    .FirstOrDefaultAsync(c => c.Email == registerDto.Email);

                if (existingBusiness != null)
                {
                    return BadRequest(new { message = "Email is al in gebruik" });
                }

                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

                var newBusiness = new Business
                {
                    FirstName = registerDto.FirstName,
                    LastName = registerDto.LastName,
                    TussenVoegsel = registerDto.TussenVoegsel,
                    Email = registerDto.Email,
                    Password = hashedPassword,
                    BusinessName = registerDto.BusinessName,
                    BusinessAddress = registerDto.BusinessAddress,
                    Kvk = registerDto.Kvk,
                    BusinessPostalCode = registerDto.BusinessPostalCode
                };

                _context.Business.Add(newBusiness);
                await _context.SaveChangesAsync();

                return Ok(new { individual = newBusiness }); 
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", details = ex.Message });
            }
        }

    }
}
