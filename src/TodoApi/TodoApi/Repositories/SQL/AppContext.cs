using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace TodoApi.Repositories.SQL;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public DbSet<UserEntity> Users { get; set; }
    public DbSet<TodoEntity> Todos { get; set; }
    public DbSet<SharedTodoUser> SharedTodoUsers { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<SharedTodoUser>()
            .HasOne(shared => shared.User)
            .WithMany(user => user.TodosSharedWithMe)
            .HasForeignKey(shared => shared.UserId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<SharedTodoUser>()
            .HasOne(shared => shared.Todo)
            .WithMany(todo => todo.SharedWith)
            .HasForeignKey(shared => shared.TodoId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<SharedTodoUser>().HasKey(shared => new { shared.UserId, shared.TodoId });

        base.OnModelCreating(modelBuilder);
    }
}