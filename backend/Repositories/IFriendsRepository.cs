using FriendsApi.Models;

namespace FriendsApi.Repositories;

public interface IFriendsRepository
{
    Task<List<Friend>> GetAllAsync();
    Task<Friend?> GetByIdAsync(string id);
    Task<Friend> CreateAsync(CreateFriendDto dto);
    Task<bool> RemoveAsync(string id);
}
