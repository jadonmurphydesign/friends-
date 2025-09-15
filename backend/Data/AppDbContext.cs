using FriendsApi.Models;
using Microsoft.EntityFrameworkCore;

namespace FriendsApi.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Friend> Friends => Set<Friend>();
}
