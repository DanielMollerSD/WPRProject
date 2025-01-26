using Moq;
using Xunit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WPRProject.Controllers;
using WPRProject.Tables;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System.Linq;
using WPRProject;

public class PrivacyTest
{
    private readonly CarsAndAllContext _context;
    private readonly PrivacyController _controller;

    public PrivacyTest()
    {
        var options = new DbContextOptionsBuilder<CarsAndAllContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new CarsAndAllContext(options);

        // Mock HttpContext and Claims
        var mockHttpContext = new Mock<HttpContext>();
        mockHttpContext.Setup(_ => _.User).Returns(new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
        {
            new Claim(ClaimTypes.Role, "Backoffice")
        }, "mock")));

        _controller = new PrivacyController(_context)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = mockHttpContext.Object
            }
        };
    }

    [Fact]
    public async Task GetPrivacyItems_ShouldReturnAllPrivacyItems()
    {
        // Arrange
        _context.Privacy.AddRange(
            new Privacy { Id = 1, Description = "Privacy Policy 1" },
            new Privacy { Id = 2, Description = "Privacy Policy 2" }
        );
        await _context.SaveChangesAsync();

        // Act
        var result = await _controller.GetPrivacyItems();

        // Assert
        var okResult = Assert.IsType<ActionResult<IEnumerable<Privacy>>>(result);
        var returnValue = Assert.IsAssignableFrom<IEnumerable<Privacy>>(okResult.Value);
        Assert.Equal(2, returnValue.Count());
    }

    [Fact]
    public async Task UpdatePrivacy_ShouldReturnNoContent_WhenPrivacyIsUpdated()
    {
        // Arrange
        var privacy = new Privacy { Id = 1, Description = "Old Privacy Policy" };
        _context.Privacy.Add(privacy);
        await _context.SaveChangesAsync();

        var updatedPrivacy = new Privacy { Id = 1, Description = "Updated Privacy Policy" };

        // Act
        var result = await _controller.UpdatePrivacy(1, updatedPrivacy);

        // Assert
        Assert.IsType<NoContentResult>(result);

        var updatedEntity = await _context.Privacy.FindAsync(1);
        Assert.Equal("Updated Privacy Policy", updatedEntity.Description);
    }

    [Fact]
    public async Task UpdatePrivacy_ShouldReturnBadRequest_WhenIdsDoNotMatch()
    {
        // Arrange
        var privacy = new Privacy { Id = 1, Description = "Old Privacy Policy" };
        _context.Privacy.Add(privacy);
        await _context.SaveChangesAsync();

        var updatedPrivacy = new Privacy { Id = 2, Description = "Updated Privacy Policy" };

        // Act
        var result = await _controller.UpdatePrivacy(1, updatedPrivacy);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Privacy ID mismatch", badRequestResult.Value);
    }

    [Fact]
    public async Task UpdatePrivacy_ShouldReturnNotFound_WhenPrivacyDoesNotExist()
    {
        // Arrange
        var updatedPrivacy = new Privacy { Id = 1, Description = "Updated Privacy Policy" };

        // Act
        var result = await _controller.UpdatePrivacy(1, updatedPrivacy);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("Privacy not found", notFoundResult.Value);
    }
}
