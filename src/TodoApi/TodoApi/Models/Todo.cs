namespace TodoApi.Models;

public class Todo
{
    public int Id { get; set; }
    public string Content { get; set; }
    public bool IsCompleted { get; set; }
    public int Priority { get; set; }
    public string UserName { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<int> SharedWith { get; set; }
}