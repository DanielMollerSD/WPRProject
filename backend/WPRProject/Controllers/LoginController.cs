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
using BCrypt.Net;

namespace WPRProject.Controllers

{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {

        private readonly CarsAndAllContext _context;
        private readonly IConfiguration _configuration;

        public LoginController(CarsAndAllContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }


       [HttpPost]
public async Task<ActionResult> Login(UserLoginDto loginDto)
{
    // Retrieve customer and employee based on the email
    var employee = await _context.Employee
        .FirstOrDefaultAsync(c => c.Email == loginDto.Email);
    var customer = await _context.Customer
        .FirstOrDefaultAsync(c => c.Email == loginDto.Email);

    // Check credentials for both customer and employee
    if (customer != null && BCrypt.Net.BCrypt.Verify(loginDto.Password, customer.Password))
    {
        // Generate claims for the customer
        List<Claim> claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, $"{customer.FirstName} {customer.LastName}"),
            new Claim(ClaimTypes.Email, customer.Email),
    
        };

        return GenerateAndSetJwtToken(claims);
    }
    else if (employee != null && BCrypt.Net.BCrypt.Verify(loginDto.Password, employee.Password))
    {
        // Generate claims for the employee
        List<Claim> claims = new List<Claim>
        {
            new Claim(ClaimTypes.Email, employee.Email),
            new Claim(ClaimTypes.Role, employee.Role), // Role claim for authorization
        
        };

        return GenerateAndSetJwtToken(claims);
    }

    // Return unauthorized if neither match
    return Unauthorized(new { Message = "Invalid credentials" });
}

private ActionResult GenerateAndSetJwtToken(List<Claim> claims)
{
    // Fetch JWT configuration
    var secretKey = _configuration["Jwt:Key"];
    var issuer = _configuration["Jwt:Issuer"];
    var audience = _configuration["Jwt:Audience"];

    if (string.IsNullOrEmpty(secretKey))
    {
        throw new ArgumentNullException("The JWT secret key is missing from configuration.");
    }

    // Generate JWT token
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
    var token = new JwtSecurityToken(
        issuer: issuer,
        audience: audience,
        claims: claims,
        expires: DateTime.Now.AddDays(7), // 7 days expiration
        signingCredentials: creds
    );

    var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

    // Set token as an HTTP-only cookie
    Response.Cookies.Append("access_token", tokenString, new CookieOptions
    {
        HttpOnly = true,
        Secure = Request.IsHttps,
        SameSite = SameSiteMode.None,
        Expires = DateTime.Now.AddDays(7)
    });

    return Ok(new { Token = tokenString });
}


    }
}