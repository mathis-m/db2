namespace TodoApi.Repositories.Mongo;

[BsonCollection("todo")]
public class TodoDocument : Document
{
    public string Content { get; set; }
    public bool IsCompleted { get; set; }
    public string UserName { get; set; }
    public int Priority { get; set; }
    public IList<string> SharedWith { get; set; }
}