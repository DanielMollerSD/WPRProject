using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;
using WPRProject.Controllers;
using WPRProject.Tables;
using WPRProject.DTOS;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using WPRProject;

public class IndividualControllerTests
{
    private readonly CarsAndAllContext _context;
    private readonly IndividualController _controller;

    public IndividualControllerTests()
    {
        // Use an in-memory database
        var options = new DbContextOptionsBuilder<CarsAndAllContext>()
            .UseInMemoryDatabase(databaseName: "TestDB")
            .Options;

        _context = new CarsAndAllContext(options);
        _controller = new IndividualController(_context);
    }

    [Fact]
    public async Task GetOneParticular_ShouldReturnIndividual_WhenExists()
    {
        // Arrange
        var individual = new Individual
        {
            Id = 1,
            FirstName = "John",
            Email = "john.doe@example.com",
            LastName = "Doe",
            Password = "SecurePassword123",
            Address = "123 Main St",
            PhoneNumber = "123-456-7890",
            PostalCode = "12345"
        };
        _context.Individual.Add(individual);
        await _context.SaveChangesAsync();

        // Act
        var result = await _controller.GetOneParticular(1);

        // Assert
        var returnedIndividual = Assert.IsType<Individual>(result.Value);
        Assert.Equal("John", returnedIndividual.FirstName);
    }


    [Fact]
    public async Task GetOneParticular_ShouldReturnNotFound_WhenDoesNotExist()
    {
        // Act
        var result = await _controller.GetOneParticular(1);

        // Assert
        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task Register_ShouldCreateNewIndividual()
    {
        // Arrange
        var registerDto = new IndividualRegisterDto
        {
            Email = "test@example.com",
            Password = "StrongPass123",
            FirstName = "John",
            LastName = "Doe",
            Address = "123 Main St",
            PostalCode = "12345",
            PhoneNumber = "123-456-7890",
            TussenVoegsel = null
        };

        // Act
        var result = await _controller.Register(registerDto);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var createdIndividual = Assert.IsAssignableFrom<Individual>(((dynamic)okResult.Value).individual);
        Assert.Equal("test@example.com", createdIndividual.Email);
        Assert.Equal("John", createdIndividual.FirstName);
    }

    [Fact]
    public async Task Register_ShouldReturnBadRequest_WhenPasswordIsTooShort()
    {
        // Arrange
        var registerDto = new IndividualRegisterDto
        {
            Email = "test@example.com",
            Password = "short",
            FirstName = "John",
            LastName = "Doe"
        };

        // Act
        var result = await _controller.Register(registerDto);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Password must be at least 8 characters long.", ((dynamic)badRequestResult.Value).message);
    }
}