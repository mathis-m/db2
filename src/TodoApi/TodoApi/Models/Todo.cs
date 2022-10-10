using System.ComponentModel.DataAnnotations;

namespace TodoApi.Models;

public class Todo
{
    public string Content { get; set; }
    public bool IsCompleted { get; set; }
    public Guid UserId { get; set; }
}