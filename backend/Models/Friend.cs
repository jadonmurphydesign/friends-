using System.ComponentModel.DataAnnotations;

namespace FriendsApi.Models;

public class Friend
{
    [Key] public string Id { get; set; } = default!;
    [Required] public string FullName { get; set; } = default!;
    public int Age { get; set; }
    public string City { get; set; } = "";
    public string FavoriteColor { get; set; } = "";
    public string Bio { get; set; } = "";
}
