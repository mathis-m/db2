using System.ComponentModel.DataAnnotations;

namespace TodoApi.Models;

public class CreateTodoRequest
{
    [Required] public string Content { get; set; } = null!;
    [Required] public bool IsCompleted { get; set; }
    [Required] public int Priority { get; set; }
    public List<string>? SharedWith { get; set; }
}