using Microsoft.EntityFrameworkCore;
using TodoApi.Models;
using TodoApi.Repositories;
using TodoApi.Repositories.SQL;

namespace TodoApi.Services;

public class TodoService
{
    private readonly IRepository<TodoEntity> _repository;
    private readonly UserService _userService;
    private readonly IRepository<SharedTodoUser> _sharedRepository;

    public TodoService(IRepository<TodoEntity> repository, UserService userService, IRepository<SharedTodoUser> sharedRepository)
    {
        _repository = repository;
        _userService = userService;
        _sharedRepository = sharedRepository;
    }

    public async Task CreateAsync(string content, int priority, IList<int> sharedWith, bool completed)
    {

        var user = await _userService.GetCurrentUser();
        var todoEntity = new TodoEntity
        {
            Content = content,
            IsCompleted = completed,
            Author = user,
            Priority = priority,
            CreatedAt = DateTime.Now,
        };

        var sharedWithLink = sharedWith.Select(userId => new SharedTodoUser { UserId = userId, Todo = todoEntity }).ToList();

        todoEntity.SharedWith = sharedWithLink;

        await _repository.InsertOneAsync(todoEntity);
    }

    public async Task<IEnumerable<TodoEntity>> GetTodosOfCurrentUser()
    {
        var user = await _userService.GetCurrentUser();
        return _repository.AsQueryable()
            .Include(x => x.SharedWith)
            .Include(x => x.Author)
            .Where(todo => todo.Author.Id == user.Id || todo.SharedWith.Any(x => x.UserId == user.Id))
            .OrderByDescending(x => x.Priority)
            .ToList();
    }

    public async Task UpdateAsync(int id, string todoContent, int todoPriority, List<int> todoSharedWith,
        bool todoIsCompleted)
    {
        var oldEntity = _repository.AsQueryable().AsNoTracking().Include(x => x.SharedWith).Include(x => x.Author).First(x => x.Id == id);
        var currentUser = await _userService.GetCurrentUser();

        if (oldEntity.Author.Id != currentUser.Id && oldEntity.SharedWith.All(user => user.Id != currentUser.Id))
        {
            throw new UnauthorizedAccessException("Cannot change not authored or shared todo");
        }

        var entity = _repository.AsQueryable().First(x => x.Id == id);
        entity.IsCompleted = todoIsCompleted;
        entity.Content = todoContent;
        entity.Priority = todoPriority;

        await _repository.SaveChanges();

        var old = oldEntity.SharedWith.Where(sharedTodoUser => !todoSharedWith.Contains(sharedTodoUser.UserId)).ToList();

        foreach (var sharedTodoUser in old)
        {
            await _sharedRepository.DeleteByIdAsync(sharedTodoUser.Id);
        }

        var userIds = todoSharedWith.Where(userId => oldEntity.SharedWith.FirstOrDefault(x => x.UserId == userId) == null);
        foreach (var userId in userIds)
        {
            await _sharedRepository.InsertOneAsync(new SharedTodoUser { UserId = userId, TodoId = entity.Id });
        }

        await _sharedRepository.SaveChanges();
    }

    public async Task DeleteAsync(int id)
    {
        var oldEntity = _repository.AsQueryable().AsNoTracking().Include(x => x.SharedWith).Include(x => x.Author).First(x => x.Id == id);

        var currentUser = await _userService.GetCurrentUser();

        if (oldEntity.Author.Id != currentUser.Id && oldEntity.SharedWith.All(user => user.Id != currentUser.Id))
        {
            throw new UnauthorizedAccessException("Cannot delete not authored or shared todo");
        }


        foreach (var sharedTodoUser in oldEntity.SharedWith)
        {
            await _sharedRepository.DeleteByIdAsync(sharedTodoUser.Id);
        }

        await _repository.DeleteByIdAsync(id);
    }

    public async Task<TodoEntity> GetTodoById(int id)
    {
        return await _repository.FindByIdAsync(id);
    }
}