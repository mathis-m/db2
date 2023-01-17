using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TodoApi.Models;
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
        await _service.CreateAsync(todo.Content, todo.Priority, todo.SharedWith ?? new List<int>(),
            todo.IsCompleted);
    }

    [HttpPut]
    [Authorize]
    public async Task Update([FromBody] UpdateTodoRequest todo)
    {
        await _service.UpdateAsync(todo.Id, todo.Content, todo.Priority, todo.SharedWith ?? new List<int>(),
            todo.IsCompleted);
    }


    [HttpDelete("{id}")]
    [Authorize]
    public async Task Delete([FromRoute] int id)
    {
        await _service.DeleteAsync(id);
    }

    [HttpGet]
    [Authorize]
    public async Task<IEnumerable<Todo>> GetTodos()
    {
        return (await _service.GetTodosOfCurrentUser()).Select(x => new Todo
        {
            Id = x.Id,
            Content = x.Content,
            IsCompleted = x.IsCompleted,
            Priority = x.Priority,
            UserName = x.Author.UserName,
            CreatedAt = x.CreatedAt,
            SharedWith = x.SharedWith.Select(y => y.UserId).ToList(),
        });
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetTodoById([FromRoute] int id)
    {
        try
        {
            var todoById = await _service.GetTodoById(id);
            return Ok(new Todo
            {
                Id = todoById.Id,
                Content = todoById.Content,
                IsCompleted = todoById.IsCompleted,
                Priority = todoById.Priority,
                UserName = todoById.Author.UserName,
                CreatedAt = todoById.CreatedAt,
                SharedWith = todoById.SharedWith.Select(y => y.UserId).ToList(),
            });
        }
        catch
        {
            return NotFound();
        }
    }
}