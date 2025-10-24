// backend-aspnet/Controllers/QuizzesController.cs
using Microsoft.AspNetCore.Mvc;
using backend_aspnet.Models;
using backend_aspnet.Services;

namespace backend_aspnet.Controllers;

public class CreateQuizRequest
{
    public string StageId { get; set; } = null!;
    public string Question { get; set; } = null!;
    public List<string> Options { get; set; } = null!;
    public int CorrectAnswerIndex { get; set; }
    public string Explanation { get; set; } = "";
    public string? Difficulty { get; set; }
}

[ApiController]
[Route("api/[controller]")]
public class QuizzesController : ControllerBase
{
    private readonly InMemoryDataService _dataService;

    public QuizzesController(InMemoryDataService dataService)
    {
        _dataService = dataService;
    }

    [HttpGet("{stageId}")]
    public async Task<List<Quiz>> GetByStageId(string stageId)
    {
        return await _dataService.GetQuizzesByStageIdAsync(stageId);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] CreateQuizRequest request)
    {
        var newQuiz = new Quiz
        {
            StageId = request.StageId,
            Question = request.Question,
            Options = request.Options,
            CorrectAnswerIndex = request.CorrectAnswerIndex,
            Explanation = request.Explanation,
            Difficulty = request.Difficulty ?? "Dễ",
        };

        await _dataService.CreateQuizAsync(newQuiz);
        return CreatedAtAction(nameof(GetByStageId), new { stageId = newQuiz.StageId }, newQuiz);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteQuiz(string id)
    {
        await _dataService.DeleteQuizAsync(id);
        return NoContent();
    }
}