using FriendsApi.Models;
using FriendsApi.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace FriendsApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FriendsController(IFriendsRepository repo) : ControllerBase
{
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
