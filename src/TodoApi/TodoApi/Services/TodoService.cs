using MongoDB.Bson;
using TodoApi.Models;
using TodoApi.Mongo;
using TodoApi.Mongo.Repositories;

namespace TodoApi.Services
{
    public class TodoService
    {
        private readonly IMongoRepository<TodoDocument> _repository;
        private readonly UserService _userService;

        public TodoService(IMongoRepository<TodoDocument> repository, UserService userService)
        {
            _repository = repository;
            _userService = userService;
        }

        public async Task CreateAsync(string content, int priority, IList<string> sharedWith, bool completed)
        {
            var user = await _userService.GetCurrentApplicationUser();
            await _repository.InsertOneAsync(new TodoDocument
            {
                Content = content,
                IsCompleted = completed,
                UserName = user.UserName,
                Priority = priority,
                SharedWith = sharedWith
            });
        }

        public async Task<IEnumerable<TodoDocument>> GetTodosOfCurrentUser()
        {
            var user = await _userService.GetCurrentUser();
            return _repository.AsQueryable()
                .Where(todo => todo.UserName == user.UserName || todo.SharedWith.Contains(user.Id.ToString()))
                .OrderByDescending(x => x.Priority)
                .ToList();
        }

        public async Task UpdateAsync(string id, string todoContent, int todoPriority, List<string> todoSharedWith, bool todoIsCompleted)
        {
            var old = await _repository.FindByIdAsync(id);
            await _repository.ReplaceOneAsync(new TodoDocument
            {
                Id = new ObjectId(id),
                Content = todoContent,
                IsCompleted = todoIsCompleted,
                UserName = old.UserName,
                Priority = todoPriority,
                SharedWith = todoSharedWith
            });
        }

        public async Task DeleteAsync(string id)
        {
            await _repository.DeleteByIdAsync(id);
        }

        public async Task<TodoDocument> GetTodoById(string id)
        {
            return await _repository.FindByIdAsync(id);
        }
    }
}