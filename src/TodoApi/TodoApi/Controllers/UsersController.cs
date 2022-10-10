using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TodoApi.Mongo;
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
    public IEnumerable<UserDocument> GetUsers()
    {
        return _service.GetAllUsers();
    }
}