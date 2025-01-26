using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using WPRProject.Tables;
using WPRProject;

public class TestStartup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddDbContext<CarsAndAllContext>(options =>
            options.UseInMemoryDatabase("TestDb")); // In-memory DB for testing
    }
    
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        app.UseRouting();
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
}
