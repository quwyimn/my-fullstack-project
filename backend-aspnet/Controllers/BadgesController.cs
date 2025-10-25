// backend-aspnet/Controllers/BadgesController.cs
using Microsoft.AspNetCore.Mvc;
using backend_aspnet.Models;
using backend_aspnet.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend_aspnet.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BadgesController : ControllerBase
{
    private readonly InMemoryDataService _dataService;

    public BadgesController(InMemoryDataService dataService)
    {
        _dataService = dataService;
    }

    [HttpGet]
    public async Task<List<Badge>> Get()
    {
        return await _dataService.GetAllBadgesAsync();
    }
}