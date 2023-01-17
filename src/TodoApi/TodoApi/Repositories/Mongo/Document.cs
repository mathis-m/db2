using MongoDB.Bson;

namespace TodoApi.Repositories.Mongo;

public abstract class Document : IDocument
{
    public ObjectId Id { get; set; }

    public DateTime CreatedAt => Id.CreationTime;
}