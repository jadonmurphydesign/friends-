using FriendsApi.Models;
using FriendsApi.Repositories;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Authorization;
namespace FriendsApi.Controllers;

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FriendsController : ControllerBase
{
    private readonly IFriendsRepository repo;
    public FriendsController(IFriendsRepository repo) => this.repo = repo;

    [HttpPut("{id}")]
    public async Task<ActionResult<Friend>> Update(string id, [FromBody] UpdateFriendDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);
        var updated = await repo.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Friend>>> GetAll() =>
        Ok(await repo.GetAllAsync());

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
