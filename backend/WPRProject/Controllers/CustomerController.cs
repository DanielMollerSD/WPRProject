using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WPRProject.DTOS;
using WPRProject.Tables;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;



namespace WPRProject.Controllers

{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {

        private readonly CarsAndAllContext _context;
         private readonly IConfiguration _configuration;

        public CustomerController(CarsAndAllContext context, IConfiguration configuration)
            {
                _context = context;
                _configuration = configuration;
            }
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
        {

            var customers = await _context.Customer.ToListAsync();
            return Ok(customers);
        }
        [HttpGet("{Id}")]
        public async Task<ActionResult<Customer>> GetOneCustomer(int id)
        {

            var customer = await _context.Customer.FindAsync(id);

            if (customer == null)
            {

                return NotFound();
            }

            return customer;
        }
        [HttpPost]
    public async Task<ActionResult<Customer>> CreateCustomer(Customer customer)
    {
     if (customer == null)
     {
        return BadRequest("Customer data is invalid.");
      }

      _context.Customer.Add(customer);
      await _context.SaveChangesAsync();

      return CreatedAtAction(nameof(GetOneCustomer), new { id = customer.Id }, customer);
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCustomer(int id, Customer customer)
    {
        if (id != customer.Id)
        {
            return BadRequest("Customer ID mismatch.");
        }

        _context.Entry(customer).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Customer.Any(e => e.Id == id))
            {
                return NotFound("Customer not found.");
            }

            throw;
        }

        return NoContent();
    }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var customer = await _context.Customer.FindAsync(id);
            if (customer == null)
            {
                return NotFound();
            }

            _context.Customer.Remove(customer);
            await _context.SaveChangesAsync();

            return NoContent();
        }

  [HttpPost("login")]
public async Task<ActionResult> Login(CustomerLoginDTO loginDto)
{
    // Validate the customer's credentials (you may need to check against your database)
    var customer = await _context.Customer
        .FirstOrDefaultAsync(c => c.Email == loginDto.Email && c.Password == loginDto.Password);

    if (customer == null)
    {
        return Unauthorized("Invalid credentials");
    }

    // Retrieve JWT settings from configuration
    var secretKey = _configuration["Jwt:Key"];
    var issuer = _configuration["Jwt:Issuer"];
    var audience = _configuration["Jwt:Audience"];

    if (string.IsNullOrEmpty(secretKey))
    {
        throw new ArgumentNullException("The JWT secret key is missing from configuration.");
    }

    // Define claims
    var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, customer.Id.ToString()),
        new Claim(ClaimTypes.Name, (customer.FirstName ?? "") + " " + (customer.LastName ?? "")),
        new Claim(ClaimTypes.Email, customer.Email)
    };

    // Create JWT token
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
    var token = new JwtSecurityToken(
        issuer: issuer,
        audience: audience,
        claims: claims,
        expires: DateTime.Now.AddMinutes(30),
        signingCredentials: creds
    );

    // Generate token string
    var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

    // Return the token as part of the response
    return Ok(new { Token = tokenString });
}

}
}
