using Moq;
using Xunit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WPRProject.Controllers;
using WPRProject.Tables;
using System.Linq;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System.Collections.Generic;
using System.Threading.Tasks;
using WPRProject;

public class SubOrderTest
{
    private readonly SubOrderController _controller;
    private readonly CarsAndAllContext _context;

    public SubOrderTest()
    {
        var options = new DbContextOptionsBuilder<CarsAndAllContext>()
            .UseInMemoryDatabase(databaseName: "TestDb")
            .Options;

        _context = new CarsAndAllContext(options);

        // Mock HttpContext and the claims
        var mockHttpContext = new Mock<HttpContext>();
        mockHttpContext.Setup(_ => _.User).Returns(new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
        {
            new Claim(ClaimTypes.Email, "test@example.com"),
            new Claim(ClaimTypes.Role, "Wagenparkbeheerder")
        }, "mock")));

        _controller = new SubOrderController(_context, null)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = mockHttpContext.Object
            }
        };
    }

    [Fact]
    public async Task CreateSubscriptionOrder_ShouldReturnCreatedAtAction_WhenValidOrder()
    {
        // Arrange
        var order = new SubscriptionOrder
        {
            StartDate = DateTime.Now,
            EndDate = DateTime.Now.AddMonths(1),
            SubscriptionId = 1
        };

        var business = new BusinessEmployee
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "test@example.com",
            Password = "SecurePassword123",
            Role = "Wagenparkbeheerder",
            BusinessId = 1
        };

        var subscription = new Subscription
        {
            Id = 1,
            Name = "Coverage",
            Description = "This is a coverage subscription."
        };

        _context.BusinessEmployee.Add(business);
        _context.Subscription.Add(subscription);
        await _context.SaveChangesAsync();

        // Act
        var result = await _controller.CreateSubscriptionOrder(order);

        // Assert
        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal("GetOrder", createdAtActionResult.ActionName);
    }


}