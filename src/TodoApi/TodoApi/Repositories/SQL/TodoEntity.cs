using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TodoApi.Repositories.SQL;

public class TodoEntity: IEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public string Content { get; set; }
    public bool IsCompleted { get; set; }
    public int Priority { get; set; }
    public DateTime CreatedAt { get; set; }
    public UserEntity Author { get; set; }
    public List<SharedTodoUser> SharedWith { get; set; } = new();
}