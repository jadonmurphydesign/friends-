using System.ComponentModel.DataAnnotations;

namespace FriendsApi.Models;

/// <summary>
/// Represents a friend entity in the system.
/// </summary>
public class Friend
{
    /// <summary>
    /// The unique identifier for the friend.
    /// </summary>
    [Key] public string Id { get; set; } = default!;

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
