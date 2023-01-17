using System.Linq.Expressions;

namespace TodoApi.Repositories;

public interface IRepository<TEntity> where TEntity: class
{
    IQueryable<TEntity> AsQueryable();
    Task<TEntity> FindOneAsync(Expression<Func<TEntity, bool>> filterExpression);
    Task<TEntity> FindByIdAsync(int id);
    Task InsertOneAsync(TEntity entity);
    Task ReplaceOneAsync(TEntity document);
    Task DeleteByIdAsync(int id);
    Task SaveChanges();
}