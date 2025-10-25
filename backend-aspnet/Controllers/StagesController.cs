// backend-aspnet/Controllers/StagesController.cs
using Microsoft.AspNetCore.Mvc;
using backend_aspnet.Models;
using backend_aspnet.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

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

    // GET /api/Stages
    [HttpGet]
    public async Task<List<Stage>> Get()
    {
        return await _dataService.GetStagesAsync();
    }

    // GET /api/Stages/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Stage>> Get(string id)
    {
        // 1. Lấy thông tin cơ bản của màn chơi
        var stage = await _dataService.GetStageByIdAsync(id);

        if (stage == null)
        {
            return NotFound();
        }

        // 2. LẤY CÁC CÂU HỎI TƯƠNG ỨNG VÀ GÁN VÀO
        stage.Quizzes = await _dataService.GetQuizzesByStageIdAsync(id);

        // 3. Trả về đối tượng stage đã được gộp dữ liệu
        return stage;
    }

    // POST /api/Stages
    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Stage stage)
    {
        await _dataService.CreateStageAsync(stage);
        return CreatedAtAction(nameof(Get), new { id = stage.Id }, stage);
    }

    // PUT /api/Stages/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStage(string id, [FromBody] Stage updatedStage)
    {
        await _dataService.UpdateStageAsync(id, updatedStage);
        return NoContent();
    }

    // DELETE /api/Stages/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStage(string id)
    {
        await _dataService.DeleteStageAsync(id);
        return NoContent();
    }
}