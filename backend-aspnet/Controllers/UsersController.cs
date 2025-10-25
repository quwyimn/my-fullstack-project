// backend-aspnet/Controllers/UsersController.cs
using Microsoft.AspNetCore.Mvc;
using BCrypt.Net;
using backend_aspnet.Models;
using backend_aspnet.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace backend_aspnet.Controllers;

// --- CÁC LỚP DTO (Data Transfer Object) ---
public class LoginRequest
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
}

public class UpdateProgressRequest
{
    public string UserId { get; set; } = null!;
    public int XpEarned { get; set; }
    public string CompletedStageId { get; set; } = null!; 
}
// -----------------------------------------

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly InMemoryDataService _dataService;

    public UsersController(InMemoryDataService dataService)
    {
        _dataService = dataService;
    }

    // Hàm helper để tạo một bản sao an toàn của User (không có password)
    private object CreateSafeUserResponse(User user)
    {
        return new 
        {
            user.Id,
            user.Username,
            user.Email,
            user.Role,
            user.Xp,
            user.CompletedStages,
            user.BadgeIds // Thêm BadgeIds vào response
        };
    }

    // GET /api/Users
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> Get()
    {
        var users = await _dataService.GetAllUsersAsync();
        return Ok(users.Select(CreateSafeUserResponse));
    }

    // GET /api/Users/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetUser(string id)
    {
        var user = await _dataService.GetUserByIdAsync(id);
        if (user is null)
        {
            return NotFound();
        }
        return Ok(CreateSafeUserResponse(user));
    }

    // POST /api/Users/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] User newUser)
    {
        var existingUser = await _dataService.GetUserByEmailAsync(newUser.Email);
        if (existingUser != null)
        {
            return BadRequest(new { message = "Email này đã được sử dụng." });
        }

        // --- KHỞI TẠO CÁC GIÁ TRỊ MẶC ĐỊNH CHO USER MỚI ---
        newUser.Xp = 0;
        newUser.Role = "Player";
        newUser.CompletedStages = new List<string>();
        newUser.BadgeIds = new List<string>();
        // ----------------------------------------------------

        // Băm mật khẩu trước khi lưu
        newUser.Password = BCrypt.Net.BCrypt.HashPassword(newUser.Password);
        
        var newId = await _dataService.CreateUserAsync(newUser);
        
        var createdUser = await _dataService.GetUserByIdAsync(newId);
        if(createdUser == null) {
            return StatusCode(500, "Lỗi khi tạo người dùng.");
        }

        return StatusCode(201, CreateSafeUserResponse(createdUser));
    }

    // POST /api/Users/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
    {
        var user = await _dataService.GetUserByEmailAsync(loginRequest.Email);
        
        if (user is null || !BCrypt.Net.BCrypt.Verify(loginRequest.Password, user.Password))
        {
            return Unauthorized(new { message = "Email hoặc mật khẩu không chính xác." });
        }

        return Ok(CreateSafeUserResponse(user));
    }
}