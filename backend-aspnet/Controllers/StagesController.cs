// backend-aspnet/Controllers/StagesController.cs
using Microsoft.AspNetCore.Mvc;
using backend_aspnet.Models;
using backend_aspnet.Services;

namespace backend_aspnet.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StagesController : ControllerBase
{
    private readonly InMemoryDataService _dataService;

    public StagesController(InMemoryDataService dataService)
    {
        _dataService = dataService;
    }

    [HttpGet]
    public async Task<List<Stage>> Get()
    {
        return await _dataService.GetStagesAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Stage>> Get(string id)
    {
        var stage = await _dataService.GetStageByIdAsync(id);
        if (stage == null) return NotFound();

        stage.Quizzes = await _dataService.GetQuizzesByStageIdAsync(id);
        return stage;
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Stage stage)
    {
        await _dataService.CreateStageAsync(stage);
        return CreatedAtAction(nameof(Get), new { id = stage.Id }, stage);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStage(string id, [FromBody] Stage updatedStage)
    {
        await _dataService.UpdateStageAsync(id, updatedStage);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStage(string id)
    {
        await _dataService.DeleteStageAsync(id);
        return NoContent();
    }
}