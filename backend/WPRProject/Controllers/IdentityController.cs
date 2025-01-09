// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;
// using WPRProject.DTOS;
// using WPRProject.Tables;
// using Microsoft.AspNetCore.Authentication.Cookies;
// using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.Authentication.JwtBearer;
// using System.IdentityModel.Tokens.Jwt;
// using System.Text;
// using Microsoft.IdentityModel.Tokens;
// using System.Security.Claims;
// using Microsoft.Extensions.Configuration;
// using BCrypt.Net;

// namespace WPRProject.Controllers
// {
//     [Route("api/[controller]")]
//     [ApiController]
//     public class IndentityController : ControllerBase
//     {

//         private readonly CarsAndAllContext _context;
//         private readonly IConfiguration _configuration;

//         public IndentityController(CarsAndAllContext context, IConfiguration configuration)
//             {
//                 _context = context;
//                 _configuration = configuration;
//             }

//     [HttpPost("refresh-token")]
//     public async Task<IActionResult> RefreshToken()
//     {
//         var refreshToken = Request.Cookies["refresh_token"];
//         if (string.IsNullOrEmpty(refreshToken))
//         {
//             return Unauthorized(new { Message = "Refresh token is missing." });
//         }

//         var customer = await _context.Customer.FirstOrDefaultAsync(c => c.RefreshToken == refreshToken);
//         if (customer == null || customer.RefreshTokenExpiryTime <= DateTime.Now)
//         {
//             return Unauthorized(new { Message = "Invalid or expired refresh token." });
//         }

//         // Generate a new JWT token
//         var newJwtToken = GenerateJwtToken(customer);

//         // Update refresh token and expiry
//         var newRefreshToken = GenerateRefreshToken();
//         customer.RefreshToken = newRefreshToken;
//         customer.RefreshTokenExpiryTime = DateTime.Now.AddDays(7);

//         await _context.SaveChangesAsync();

//         // Set new cookies
//         Response.Cookies.Append("access_token", newJwtToken, new CookieOptions
//         {
//             HttpOnly = true,
//             Secure = false,
//             SameSite = SameSiteMode.Strict,
//             Expires = DateTime.Now.AddMinutes(30)
//         });

//         Response.Cookies.Append("refresh_token", newRefreshToken, new CookieOptions
//         {
//             HttpOnly = true,
//             Secure = false,
//             SameSite = SameSiteMode.Strict,
//             Expires = DateTime.Now.AddDays(7)
//         });

//         return Ok(new { Token = newJwtToken });
//         }
//     }
// }