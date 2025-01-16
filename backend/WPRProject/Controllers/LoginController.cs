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
            var employee = await _context.Employee
            .FirstOrDefaultAsync(c => c.Email == loginDto.Email);
            var customer = await _context.Customer
            .FirstOrDefaultAsync(c => c.Email == loginDto.Email);


            if (customer == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, customer.Password))
            {
                if (employee == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, employee.Password))
                {
                    return Unauthorized(new { Message = "Invalid credentials" });
                }
            }

            var secretKey = _configuration["Jwt:Key"];
            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];

            if (string.IsNullOrEmpty(secretKey))
            {
                throw new ArgumentNullException("The JWT secret key is missing from configuration.");
            }


            List<Claim> claims = null;

            if (customer != null)
            {
                claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, (customer.FirstName ?? "") + " " + (customer.LastName ?? "")),
                new Claim(ClaimTypes.Email, customer.Email)
            };
            }
            else if (employee != null)
            {
                claims = new List<Claim>
            {
                new Claim(ClaimTypes.Role, employee.Role),
                new Claim(ClaimTypes.Email, employee.Email)
            };

            }
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.Now.AddMinutes(60 * 24 * 7),
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            Response.Cookies.Append("access_token", tokenString, new CookieOptions
            {
                HttpOnly = true,
                Secure = Request.IsHttps,
                SameSite = SameSiteMode.None,
                Expires = DateTime.Now.AddMinutes(60 * 24 * 7)
            });


            return Ok(new { Token = tokenString });
        }

    }
}