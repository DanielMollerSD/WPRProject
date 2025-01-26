using Moq;
using Xunit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WPRProject.Controllers;
using WPRProject.DTOS;
using WPRProject.Tables;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using WPRProject;
using Microsoft.Extensions.Configuration;

public class LoginTest
{
    private readonly LoginController _controller;
    private readonly CarsAndAllContext _context;

    public LoginTest()
    {
        // Use In-Memory Database
        var options = new DbContextOptionsBuilder<CarsAndAllContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_LoginController")
            .Options;

        _context = new CarsAndAllContext(options);

        // Mock IConfiguration
        var mockConfiguration = new Mock<IConfiguration>();
        mockConfiguration.SetupGet(x => x[It.IsAny<string>()]).Returns("SomeValue");

        _controller = new LoginController(_context, mockConfiguration.Object);
    }

    [Fact]
    public async Task Login_ShouldReturnUnauthorized_WhenInvalidCredentials()
    {
        // Arrange
        var loginDto = new UserLoginDto
        {
            Email = "invalid@example.com",
            Password = "wrongPassword"
        };

        // Act
        var result = await _controller.Login(loginDto);

        // Assert
        var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
        Assert.Equal(401, unauthorizedResult.StatusCode);
    }
}