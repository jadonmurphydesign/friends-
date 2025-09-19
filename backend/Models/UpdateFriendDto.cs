using System.ComponentModel.DataAnnotations;

namespace FriendsApi.Models;

/// <summary>
/// Data Transfer Object for updating an existing friend.
/// </summary>
public class UpdateFriendDto
{
    /// <summary>
    /// The full name of the friend.
    /// </summary>
    [Required] public string FullName { get; set; } = default!;

    /// <summary>
    /// The age of the friend.
    /// </summary>
    public int Age { get; set; }

    /// <summary>
    /// The city where the friend lives.
    /// </summary>
    public string City { get; set; } = "";

    /// <summary>
    /// The friend's favorite color.
    /// </summary>
    public string FavoriteColor { get; set; } = "";

    /// <summary>
    /// A short biography or description of the friend.
    /// </summary>
    public string Bio { get; set; } = "";
}
