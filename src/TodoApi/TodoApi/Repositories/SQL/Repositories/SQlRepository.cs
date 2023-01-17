using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace TodoApi.Repositories.SQL.Repositories;

public class SQlRepository<TEntity> : IRepository<TEntity> where TEntity : class, IEntity
{
    private readonly AppDbContext _context;
    private DbSet<TEntity> _table;

    public SQlRepository(AppDbContext context)
    {
        _context = context;
        _table = context.Set<TEntity>();
    }

    public IQueryable<TEntity> AsQueryable()
    {
        return _table.AsQueryable();
    }

    public async Task<TEntity> FindOneAsync(Expression<Func<TEntity, bool>> filterExpression)
    {
        var result = _table.AsQueryable().FirstOrDefaultAsync(filterExpression);

        if (result == null)
        {
            throw new Exception("Entity was not found");
        }

        var entity = await result;

        return entity ?? throw new Exception("Entity was not found");
        ;
    }

    public async Task<TEntity> FindByIdAsync(int id)
    {
        var result = _table.AsQueryable().AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (result == null)
        {
            throw new Exception("Entity was not found");
        }

        var entity = await result;

        return entity ?? throw new Exception("Entity was not found");
    }

    public async Task InsertOneAsync(TEntity entity)
    {
        await _table.AddAsync(entity);
        await _context.SaveChangesAsync();
    }

    public async Task ReplaceOneAsync(TEntity entity)
    {
        _table.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteByIdAsync(int id)
    {
        var entity = await FindByIdAsync(id);
        _table.Remove(entity);
        await _context.SaveChangesAsync();
    }

    public async Task SaveChanges()
    {
        await _context.SaveChangesAsync();
    }
}