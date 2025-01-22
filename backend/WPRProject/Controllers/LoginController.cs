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
using WPRProject.Utilities;

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
            // First, try to find the user in the Employee table
            var employee = await _context.Employee
                .FirstOrDefaultAsync(c => c.Email == loginDto.Email);

            // If not found in Employee, check the Customer table for BusinessEmployee or Individual
            var customer = await _context.Customer
                .FirstOrDefaultAsync(c => c.Email == loginDto.Email);

            if (employee != null && BCrypt.Net.BCrypt.Verify(loginDto.Password, employee.Password))
            {
                // Handle Employee login
                List<Claim> claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Email, employee.Email),
                    new Claim(ClaimTypes.Role, employee.Role), // Role claim for authorization
                };

                return GenerateAndSetJwtToken(claims);
            }
            else if (customer != null && BCrypt.Net.BCrypt.Verify(loginDto.Password, customer.Password))
            {
                // Handle BusinessEmployee or Individual login
                List<Claim> claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, $"{customer.FirstName} {customer.LastName}"),
                    new Claim(ClaimTypes.Email, customer.Email),
                };

                if (customer is BusinessEmployee businessEmployee)
                {
                    // Handle BusinessEmployee login
                    var businessId = await _context.Business
                        .Where(b => b.BusinessId == businessEmployee.BusinessId)
                        .Select(b => b.BusinessId)
                        .FirstOrDefaultAsync();

                    claims.Add(new Claim(ClaimTypes.Role, businessEmployee.Role));
                    claims.Add(new Claim(CustomClaimTypes.BusinessId, businessId.ToString()));
                }
                else if (customer is Individual)
                {
                    // Handle Individual login
                    claims.Add(new Claim(ClaimTypes.Role, "Individual"));
                }

                return GenerateAndSetJwtToken(claims);
            }

            // If no match, return Unauthorized
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
