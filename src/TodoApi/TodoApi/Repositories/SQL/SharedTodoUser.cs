using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TodoApi.Repositories.SQL;

public class SharedTodoUser: IEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public int TodoId { get; set; }
    public TodoEntity Todo { get; set; }

    public int UserId { get; set; }
    public UserEntity User { get; set; }
}