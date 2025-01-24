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
using Microsoft.AspNetCore.Authorization;


namespace WPRProject.Controllers

{
    [Route("api/[controller]")]
    [ApiController]
    public class IndividualController : ControllerBase
    {

        private readonly CarsAndAllContext _context;
       

        public IndividualController(CarsAndAllContext context)
        {
            _context = context;
        }
        
        [Authorize(Roles = "Individual")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Individual>>> GetParticulars()
        {

            var damages = await _context.Individual.ToListAsync();
            return Ok(damages);
        }

        [Authorize(Roles = "Individual")]
        [HttpGet("{Id}")]
        public async Task<ActionResult<Individual>> GetOneParticular(int id)
        {

            var particular = await _context.Individual.FindAsync(id);

            if (particular == null)
            {
                return NotFound();
            }

            return particular;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] IndividualRegisterDto registerDto)
        {
            try
            {
                var existingCustomer = await _context.Customer
                    .FirstOrDefaultAsync(c => c.Email == registerDto.Email);

                if (existingCustomer != null)
                {
                    return BadRequest(new { message = "Email is al in gebruik" });
                }

                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

                var newIndividual = new Individual
                {
                    Email = registerDto.Email,
                    Password = hashedPassword,
                    FirstName = registerDto.FirstName,
                    LastName = registerDto.LastName,
                    TussenVoegsel = registerDto.TussenVoegsel,
                    PhoneNumber = registerDto.PhoneNumber,
                    Address = registerDto.Address,
                    PostalCode = registerDto.PostalCode,
                };

                _context.Customer.Add(newIndividual);
                await _context.SaveChangesAsync();

                return Ok(new { individual = newIndividual }); 
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", details = ex.Message });
            }
        }
        

    }
}
