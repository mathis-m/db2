using IdentityMongo.Models;
using Microsoft.AspNetCore.Identity;
using TodoApi.Mongo;
using TodoApi.Mongo.Repositories;

namespace TodoApi.Services
{
    public class UserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMongoRepository<UserDocument> _userRepository;

        public UserService(IHttpContextAccessor httpContextAccessor, UserManager<ApplicationUser> userManager,
            IMongoRepository<UserDocument> userRepository)
        {
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
            _userRepository = userRepository;
        }

        public async Task<ApplicationUser> GetCurrentApplicationUser()
        {
            var name = _httpContextAccessor.HttpContext?.User.Identity?.Name;
            if (name == null) throw new Exception("Cannot access user");

            var user = await _userManager.FindByNameAsync(name);
            if (user == null) throw new Exception("User could not be found");

            return user;
        }

        public async Task CreateUser(string email, string username, string firstName, string lastName)
        {
            await _userRepository.InsertOneAsync(new UserDocument
            {
                UserName = username,
                Email = email,
                FirstName = firstName,
                LastName = lastName
            });
        }

        public async Task<UserDocument> GetUserByUserName(string userName)
        {
            return await _userRepository.FindOneAsync(x => x.UserName == userName);
        }

        public async Task<UserDocument> GetCurrentUser()
        {
            var current = await GetCurrentApplicationUser();
            return await _userRepository.FindOneAsync(x => x.UserName == current.UserName);
        }

        public IEnumerable<UserDocument> GetAllUsers()
        {
            return _userRepository.AsQueryable().ToList();
        }
    }
}