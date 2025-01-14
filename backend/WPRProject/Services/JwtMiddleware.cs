using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

public class JwtMiddleware
{
    private readonly RequestDelegate _next;
    private readonly string _secretKey;

    public JwtMiddleware(RequestDelegate next, IConfiguration configuration)
    {
        _next = next;
        _secretKey = configuration["Jwt:Key"];
    }

    public async Task Invoke(HttpContext context)
    {
        var token = context.Request.Cookies["access_token"];
        if (!string.IsNullOrEmpty(token))
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_secretKey);

                var tokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = context.RequestServices.GetRequiredService<IConfiguration>()["Jwt:Issuer"],
                    ValidAudience = context.RequestServices.GetRequiredService<IConfiguration>()["Jwt:Audience"],
                    ValidateLifetime = true
                };

                var claimsPrincipal = tokenHandler.ValidateToken(token, tokenValidationParameters, out _);
                context.User = claimsPrincipal; // Attach the user to the context
            }
            catch
            {
                // Token validation failed
                // You can log this or simply skip adding claims to the context
            }
        }

        await _next(context);
    }
}
