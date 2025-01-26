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
using WPRProject;

public class VehicleTest
{
    private readonly VehicleController _controller;
    private readonly CarsAndAllContext _context;

    public VehicleTest()
    {
        var options = new DbContextOptionsBuilder<CarsAndAllContext>()
            .UseInMemoryDatabase(databaseName: "TestDb") // In-memory database for testing
            .Options;

        _context = new CarsAndAllContext(options);

        // Mock HttpContext and Claims
        var mockHttpContext = new Mock<HttpContext>();
        mockHttpContext.Setup(_ => _.User).Returns(new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
        {
            new Claim(ClaimTypes.Role, "Medewerker")
        }, "mock")));

        _controller = new VehicleController(_context)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = mockHttpContext.Object
            }
        };
    }

    [Fact]
    public async Task GetVehicles_ShouldReturnFilteredVehicles_WhenParametersAreProvided()
    {
        // Arrange
        _context.Vehicle.AddRange(
            new Vehicle { Id = 1, VehicleType = "Car", Brand = "Toyota", Price = 5000, Color = "Red", LicensePlate = "ABC123", Model = "Corolla", Note = "Test note", Status = "Available" },
            new Vehicle { Id = 2, VehicleType = "Car", Brand = "Honda", Price = 7000, Color = "Blue", LicensePlate = "XYZ456", Model = "Civic", Note = "Test note", Status = "Available" }
        );
        await _context.SaveChangesAsync();

        // Act
        var result = await _controller.GetVehicles("Car", "Honda", null, null, null, null);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsAssignableFrom<IEnumerable<Vehicle>>(okResult.Value);
        Assert.Single(returnValue);
    }

    [Fact]
    public async Task CreateVehicle_ShouldReturnCreatedAtAction_WhenValidVehicleIsProvided()
    {
        // Arrange
        var newVehicle = new Vehicle
        {
            LicensePlate = "NEW123",
            Brand = "BMW",
            Model = "X5",
            Color = "Black",
            Status = "Available",
            Note = "Brand new vehicle",
            Price = 8000,
            PurchaseYear = 2023,
            VehicleType = "SUV"
        };

        // Act
        var result = await _controller.CreateVehicle(newVehicle);

        // Assert
        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        Assert.Equal("GetVehicleById", createdAtActionResult.ActionName);
        var createdVehicle = Assert.IsType<Vehicle>(createdAtActionResult.Value);
        Assert.Equal(newVehicle.LicensePlate, createdVehicle.LicensePlate);
        Assert.Equal(newVehicle.Brand, createdVehicle.Brand);
        Assert.Equal(newVehicle.Model, createdVehicle.Model);
    }
}
