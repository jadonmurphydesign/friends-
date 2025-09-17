using FriendsApi.Data;
using FriendsApi.Models;
using Microsoft.EntityFrameworkCore;

namespace FriendsApi.Repositories;

public class FriendsRepository(AppDbContext db) : IFriendsRepository
{
    public Task<List<Friend>> GetAllAsync() =>
        db.Friends.AsNoTracking().OrderBy(f => f.FullName).ToListAsync();

    public Task<Friend?> GetByIdAsync(string id) =>
        db.Friends.AsNoTracking().FirstOrDefaultAsync(f => f.Id == id);

    public async Task<Friend> CreateAsync(CreateFriendDto dto)
    {
        var entity = new Friend
        {
            Id = Guid.NewGuid().ToString("n"),
            FullName = dto.FullName.Trim(),
            Age = dto.Age,
            City = dto.City?.Trim() ?? "",
            FavoriteColor = dto.FavoriteColor?.Trim() ?? "",
            Bio = dto.Bio?.Trim() ?? ""
        };
        db.Friends.Add(entity);
        await db.SaveChangesAsync();
        return entity;
    }

    public async Task<Friend?> UpdateAsync(string id, UpdateFriendDto dto)
    {
        var entity = await db.Friends.FirstOrDefaultAsync(f => f.Id == id);
        if (entity is null) return null;
        entity.FullName = dto.FullName.Trim();
        entity.Age = dto.Age;
        entity.City = dto.City?.Trim() ?? "";
        entity.FavoriteColor = dto.FavoriteColor?.Trim() ?? "";
        entity.Bio = dto.Bio?.Trim() ?? "";
        await db.SaveChangesAsync();
        return entity;
    }

    public async Task<bool> RemoveAsync(string id)
    {
        var entity = await db.Friends.FirstOrDefaultAsync(f => f.Id == id);
        if (entity is null) return false;
        db.Friends.Remove(entity);
        await db.SaveChangesAsync();
        return true;
    }
}
