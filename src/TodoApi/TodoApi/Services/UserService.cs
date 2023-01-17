using Microsoft.AspNetCore.Identity;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;
using TodoApi.Repositories;
using TodoApi.Repositories.SQL;

namespace TodoApi.Services;

public class UserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IRepository<UserEntity> _userRepository;
    private readonly AppDbContext _context;

    public UserService(IHttpContextAccessor httpContextAccessor, UserManager<ApplicationUser> userManager,
        IRepository<UserEntity> userRepository, AppDbContext context)
    {
        _httpContextAccessor = httpContextAccessor;
        _userManager = userManager;
        _userRepository = userRepository;
        _context = context;
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
        await _userRepository.InsertOneAsync(new UserEntity
        {
            UserName = username,
            Email = email,
            FirstName = firstName,
            LastName = lastName
        });
    }

    public async Task<UserEntity> GetUserByUserName(string userName)
    {
        return await _userRepository.FindOneAsync(x => x.UserName == userName);
    }

    public async Task<UserEntity> GetCurrentUser()
    {
        var current = await GetCurrentApplicationUser();
        return await _userRepository.FindOneAsync(x => x.UserName == current.UserName);
    }

    public IEnumerable<UserEntity> GetAllUsers()
    {
        return _context.Users.FromSqlRaw("GetUsers").ToList();
    }

    public int CountUsers()
    {
        var parameterReturn = new SqlParameter
        {
            ParameterName = "ReturnValue",
            SqlDbType = System.Data.SqlDbType.Int,
            Direction = System.Data.ParameterDirection.Output,
        };

        _context.Database.ExecuteSqlRaw("Exec @returnValue = [dbo].[CountUsers]", parameterReturn);

        var returnValue = (int)parameterReturn.Value;

        return returnValue;
    }
}