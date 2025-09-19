using FriendsApi.Models;
using FriendsApi.Repositories;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Authorization;
namespace FriendsApi.Controllers;

    /// <summary>
    /// Controller for managing friends. Provides endpoints to create, update, retrieve, and delete friends.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FriendsController : ControllerBase
{
    private readonly IFriendsRepository repo;
    public FriendsController(IFriendsRepository repo) => this.repo = repo;

    /// <summary>
    /// Updates an existing friend by ID.
    /// </summary>
    /// <param name="id">The ID of the friend to update.</param>
    /// <param name="dto">The updated friend data.</param>
    /// <returns>The updated friend if found; otherwise, NotFound.</returns>
    [HttpPut("{id}")]
    public async Task<ActionResult<Friend>> Update(string id, [FromBody] UpdateFriendDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);
        var updated = await repo.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }
    /// <summary>
    /// Retrieves all friends.
    /// </summary>
    /// <returns>A list of all friends.</returns>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Friend>>> GetAll()
    {
        return Ok(await repo.GetAllAsync());
    }

    /// <summary>
    /// Retrieves a friend by their ID.
    /// </summary>
    /// <param name="id">The ID of the friend to retrieve.</param>
    /// <returns>The friend if found; otherwise, NotFound.</returns>
    [HttpGet("{id}")]
    public async Task<ActionResult<Friend>> GetById(string id)
    {
        var friend = await repo.GetByIdAsync(id);
        return friend is null ? NotFound() : Ok(friend);
    }

    [HttpPost]
    public async Task<ActionResult<Friend>> Create([FromBody] CreateFriendDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);
        var created = await repo.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var ok = await repo.RemoveAsync(id);
        return ok ? NoContent() : NotFound();
    }
}
