using System.ComponentModel.DataAnnotations;

namespace FriendsApi.Models;

public class CreateFriendDto
{
    [Required] public string FullName { get; set; } = default!;
    public int Age { get; set; }
    public string City { get; set; } = "";
    public string FavoriteColor { get; set; } = "";
    public string Bio { get; set; } = "";
}