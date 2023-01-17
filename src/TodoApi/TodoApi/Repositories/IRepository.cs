using System.Linq.Expressions;
using TodoApi.Repositories.Mongo;

namespace TodoApi.Repositories;

public interface IRepository<TDocument> where TDocument : IDocument
{
    IQueryable<TDocument> AsQueryable();
    Task<TDocument> FindOneAsync(Expression<Func<TDocument, bool>> filterExpression);
    Task<TDocument> FindByIdAsync(string id);
    Task InsertOneAsync(TDocument document);
    Task ReplaceOneAsync(TDocument document);
    Task DeleteByIdAsync(string id);
}