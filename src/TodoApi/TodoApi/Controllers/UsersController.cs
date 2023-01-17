using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TodoApi.Models;
using TodoApi.Services;

namespace TodoApi.Controllers;

[ApiController]
[Route("[controller]")]
public class UsersController : ControllerBase
{
    private readonly ILogger<UsersController> _logger;
    private readonly UserService _service;

    public UsersController(ILogger<UsersController> logger, UserService service)
    {
        _logger = logger;
        _service = service;
    }

    [HttpGet]
    [Authorize]
    public IEnumerable<User> GetUsers()
    {
        return _service.GetAllUsers().Select(x => new User
        {
            Id = x.Id,
            Email = x.Email,
            FirstName = x.FirstName,
            LastName = x.LastName,
            UserName = x.UserName,
        });
    }

    [HttpGet("count")]
    [Authorize]
    public int CountUsers()
    {
        return _service.CountUsers();
    }
}