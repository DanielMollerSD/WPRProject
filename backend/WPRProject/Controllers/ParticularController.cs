using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WPRProject.Tables;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using WPRProject.Models;
using WPRProject.Data;
using Microsoft.Extensions.Configuration;
using System.Security.Cryptography;
using System.Text;
using BCrypt.Net;


namespace WPRProject.Controllers

{
    [Route("api/[controller]")]
    [ApiController]
    public class ParticularController : ControllerBase
    {

        private readonly CarsAndAllContext _context;
       

        public ParticularController(CarsAndAllContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Particular>>> GetParticulars()
        {

            var damages = await _context.Damage.ToListAsync();
            return Ok(damages);
        }
        [HttpGet("{Id}")]
        public async Task<ActionResult<Particular>> GetOneParticular(int id)
        {

            var particular = await _context.Damage.FindAsync(id);

            if (particular == null)
            {
                return NotFound();
            }

            return particular;
        }

        [HttpPost("registerPartiuclar")]

        public async Task<IActionResult> Register ([FromBody]ParticularRegisterDto registerDto)
        {
            var existingCustomer = await _context.Customer
                .FirstOrDefaultAsync(c => c.Email == registerDto.Email);


            if (existingCustomer != null)
            {
                return BadRequest("Email is al in gebruik");
            }    

            var passwordHash = BCrypt.HashPassword(registerDto.Password);

            var newCustomer = new Customer
            {
                Email = registerDto.Email,
                Password = passwordHash,
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                TussenVoegsel = registerDto.TussenVoegsel,
                PhoneNumber = registerDto.PhoneNumber,
                Address = registerDto.Address,
                PostalCode = registerDto.PostalCode
            };

            _context.Customer.Add(newCustomer);
            await _context.SaveChangesAsync();

            return Ok(new{Message ="Registreren succesvol"});
        }

        }
    }

