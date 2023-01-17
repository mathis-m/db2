using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TodoApi.Models;
using TodoApi.Repositories.Mongo;
using TodoApi.Services;

namespace TodoApi.Controllers;

[ApiController]
[Route("[controller]")]
public class TodosController : ControllerBase
{
    private readonly ILogger<TodosController> _logger;
    private readonly TodoService _service;

    public TodosController(ILogger<TodosController> logger, TodoService service)
    {
        _logger = logger;
        _service = service;
    }


    [HttpPost]
    [Authorize]
    public async Task Create([FromBody] CreateTodoRequest todo)
    {
        await _service.CreateAsync(todo.Content, todo.Priority, todo.SharedWith ?? new List<string>(),
            todo.IsCompleted);
    }

    [HttpPut]
    [Authorize]
    public async Task Update([FromBody] UpdateTodoRequest todo)
    {
        await _service.UpdateAsync(todo.Id, todo.Content, todo.Priority, todo.SharedWith ?? new List<string>(),
            todo.IsCompleted);
    }


    [HttpDelete("{id}")]
    [Authorize]
    public async Task Delete([FromRoute] string id)
    {
        await _service.DeleteAsync(id);
    }

    [HttpGet]
    [Authorize]
    public async Task<IEnumerable<TodoDocument>> GetTodos()
    {
        return await _service.GetTodosOfCurrentUser();
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetTodoById([FromRoute] string id)
    {
        try
        {
            return Ok(await _service.GetTodoById(id));
        }
        catch
        {
            return NotFound();
        }
    }
}