using TodoApi.Mongo.Repositories;

namespace TodoApi.Mongo;

[BsonCollection("user")]
public class UserDocument : Document
{
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string UserName { get; set; }
}