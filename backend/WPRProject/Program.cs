using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Text;
using WPRProject.Settings;
using WPRProject.Tables;

namespace WPRProject
{
    public static class Program
    {
        public static void Main(string[] args)
        {

            Log.Logger = new LoggerConfiguration()
                .ReadFrom.Configuration(new ConfigurationBuilder()
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true).Build())
                .Enrich.FromLogContext()
                .CreateLogger();

            try
            {
                Log.Information("Starting application");

                var builder = WebApplication.CreateBuilder(args);
                builder.Host.UseSerilog((context, loggerConfig) =>
                    loggerConfig.ReadFrom.Configuration(context.Configuration)
                );

                // Add Serilog to the logging pipeline
                builder.Logging.ClearProviders();
                builder.Host.UseSerilog();    

                // Add services to the container.
                builder.Services.AddRazorPages();

                builder.Services.AddDbContext<CarsAndAllContext>(options =>
                    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

                builder.Services.AddControllers();

                // Register SMTP settings and email service
                builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("SmtpSettings"));
                builder.Services.AddTransient<EmailService>();

                // Learn more about configuring Swagger/OpenAPI
                builder.Services.AddEndpointsApiExplorer();
                builder.Services.AddSwaggerGen();

                builder.Services.AddCors(options =>
                {
                    options.AddPolicy("AllowSpecificOrigin", policy =>
                    {
                        policy.WithOrigins("http://localhost:5173")
                            .AllowAnyMethod()
                            .AllowAnyHeader()
                            .AllowCredentials();
                    });
                });

                builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                    .AddJwtBearer(options =>
                    {
                        options.TokenValidationParameters = new TokenValidationParameters
                        {
                            ValidateIssuer = true,
                            ValidateAudience = true,
                            ValidateLifetime = true,
                            ValidateIssuerSigningKey = true,
                            ValidIssuer = builder.Configuration["Jwt:Issuer"],
                            ValidAudience = builder.Configuration["Jwt:Audience"],
                            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
                        };
                    });

                var app = builder.Build();

                if (app.Environment.IsDevelopment())
                {
                    app.UseSwagger();
                    app.UseSwaggerUI();
                }

                app.UseHttpsRedirection();

                app.UseCors("AllowSpecificOrigin");
                app.UseMiddleware<JwtMiddleware>();

                app.UseAuthentication();
                app.UseAuthorization();

                app.MapControllers();

                app.Run();
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "Application failed to start");
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }
    }
}