using System.ComponentModel.DataAnnotations;

namespace TodoApi.Models;

public class UpdateTodoRequest
{
    [Required] public string Id { get; set; } = null!;
    [Required] public string Content { get; set; } = null!;
    [Required] public bool IsCompleted { get; set; }
    [Required] public int Priority { get; set; }
    public List<string>? SharedWith { get; set; }
}