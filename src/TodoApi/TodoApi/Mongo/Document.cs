using MongoDB.Bson;

namespace TodoApi.Mongo.Repositories;

public abstract class Document : IDocument
{
    public ObjectId Id { get; set; }

    public DateTime CreatedAt => Id.CreationTime;
}