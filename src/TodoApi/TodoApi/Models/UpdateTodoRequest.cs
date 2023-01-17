using System.ComponentModel.DataAnnotations;

namespace TodoApi.Models;

public class UpdateTodoRequest
{
    [Required] public int Id { get; set; }
    [Required] public string Content { get; set; } = null!;
    [Required] public bool IsCompleted { get; set; }
    [Required] public int Priority { get; set; }
    public List<int>? SharedWith { get; set; }
}