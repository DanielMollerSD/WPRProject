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
    public class LogoutController : ControllerBase
    {

        private readonly CarsAndAllContext _context;
        private readonly IConfiguration _configuration;

        public LogoutController(CarsAndAllContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpDelete]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("access_token");
            return Ok(new{message = "Logout succesful"});
        }
       

    }
}