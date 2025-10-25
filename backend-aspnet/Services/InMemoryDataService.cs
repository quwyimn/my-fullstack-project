// backend-aspnet/Services/InMemoryDataService.cs
using backend_aspnet.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend_aspnet.Services;

public class InMemoryDataService
{
    // Dùng 'static' để dữ liệu tồn tại qua nhiều request, giống như một CSDL thực sự
    private static List<User> _users;
    private static List<Stage> _stages;
    private static List<Quiz> _quizzes;
    private static List<Badge> _badges;

    // Sử dụng static constructor để khởi tạo dữ liệu một lần duy nhất khi ứng dụng bắt đầu
    static InMemoryDataService()
    {
        // 1. Khởi tạo dữ liệu gốc từ MockDataService
        _stages = MockDataService.GetMockStages();
        _quizzes = MockDataService.GetAllMockQuizzes();

        // 2. Khởi tạo danh sách huy hiệu mẫu
        _badges = new List<Badge>
        {
            new Badge { Id = "badge-thuy-thu", Name = "Thủy Thủ Tập Sự", Description = "Hoàn thành màn chơi đầu tiên.", Icon = "fa-solid fa-water" },
            new Badge { Id = "badge-sap-xep", Name = "Bậc Thầy Sắp Xếp", Description = "Chinh phục thử thách về thuật toán sắp xếp.", Icon = "fa-solid fa-sort" },
            new Badge { Id = "badge-quy-hoach-dong", Name = "Chiến Lược Gia", Description = "Vượt qua màn chơi về Quy hoạch động.", Icon = "fa-solid fa-chess-king" }
        };

        // 3. Gán huy hiệu cho các màn chơi tương ứng
        // Dấu ! để khẳng định với compiler rằng chúng ta biết chắc stage này tồn tại
        _stages.FirstOrDefault(s => s.Id == "stage1")!.BadgeId = "badge-thuy-thu";
        _stages.FirstOrDefault(s => s.Id == "stage3")!.BadgeId = "badge-sap-xep";
        _stages.FirstOrDefault(s => s.Id == "stage5")!.BadgeId = "badge-quy-hoach-dong";

        // 4. Lấy ra tất cả các Stage ID để gán cho tài khoản Admin
        var allStageIds = _stages.Select(s => s.Id!).ToList(); // Dùng ! để báo id không null
        _users = new List<User>
        {
            new User 
            { 
                Id = "user-player-1", 
                Username = "player1", 
                Email = "test@t.com", 
                Password = BCrypt.Net.BCrypt.HashPassword("123456"), 
                Role = "Player", 
                Xp = 150, 
                CompletedStages = new List<string> { "stage1" },
                BadgeIds = new List<string> { "badge-thuy-thu" } // Thưởng sẵn huy hiệu cho player1
            },
            new User 
            { 
                Id = "user-admin-1", 
                Username = "admin", 
                Email = "admin@algo.com", 
                Password = BCrypt.Net.BCrypt.HashPassword("admin123"), 
                Role = "Admin", 
                Xp = 9999, 
                CompletedStages = allStageIds, // Gán tất cả màn đã hoàn thành
                BadgeIds = _badges.Select(b => b.Id).ToList() // Gán tất cả huy hiệu
            }
        };
    }

    // --- USERS ---
    public async Task<List<User>> GetAllUsersAsync() => await Task.FromResult(_users);
    public async Task<User?> GetUserByEmailAsync(string email) => await Task.FromResult(_users.FirstOrDefault(u => u.Email == email));
    public async Task<User?> GetUserByIdAsync(string id) => await Task.FromResult(_users.FirstOrDefault(u => u.Id == id));
    
    public async Task<string> CreateUserAsync(User user)
    {
        user.Id = $"user_{_users.Count + 1}_{System.Guid.NewGuid().ToString().Substring(0, 4)}";
        _users.Add(user);
        return await Task.FromResult(user.Id);
    }

    public async Task UpdateUserProgressAsync(string userId, int xpGained, string completedStageId)
    {
        var user = _users.FirstOrDefault(u => u.Id == userId);
        var stage = _stages.FirstOrDefault(s => s.Id == completedStageId);

        if (user != null)
        {
            user.Xp += xpGained;
            if (!user.CompletedStages.Contains(completedStageId))
            {
                user.CompletedStages.Add(completedStageId);
            }

            // Logic thưởng huy hiệu
            if (stage != null && !string.IsNullOrEmpty(stage.BadgeId))
            {
                if (!user.BadgeIds.Contains(stage.BadgeId))
                {
                    user.BadgeIds.Add(stage.BadgeId);
                }
            }
        }
        await Task.CompletedTask;
    }

    // --- STAGES ---
    public async Task<List<Stage>> GetStagesAsync() => await Task.FromResult(_stages.OrderBy(s => s.Order).ToList());
    public async Task<Stage?> GetStageByIdAsync(string id) => await Task.FromResult(_stages.FirstOrDefault(s => s.Id == id));
    
    public async Task CreateStageAsync(Stage stage)
    {
        stage.Id = $"stage_{_stages.Count + 1}_{System.Guid.NewGuid().ToString().Substring(0, 4)}";
        _stages.Add(stage);
        await Task.CompletedTask;
    }
    
    public async Task UpdateStageAsync(string id, Stage updatedStage)
    {
        var stage = _stages.FirstOrDefault(s => s.Id == id);
        if (stage != null)
        {
            stage.Name = updatedStage.Name;
            stage.Description = updatedStage.Description;
            stage.Difficulty = updatedStage.Difficulty;
            stage.Order = updatedStage.Order;
            stage.BackgroundUrl = updatedStage.BackgroundUrl;
            stage.BadgeId = updatedStage.BadgeId; // Thêm cập nhật BadgeId
        }
        await Task.CompletedTask;
    }

    public async Task DeleteStageAsync(string id)
    {
        _stages.RemoveAll(s => s.Id == id);
        _quizzes.RemoveAll(q => q.StageId == id);
        await Task.CompletedTask;
    }

    // --- QUIZZES ---
    public async Task<List<Quiz>> GetQuizzesByStageIdAsync(string stageId)
    {
        return await Task.FromResult(_quizzes.Where(q => q.StageId == stageId).ToList());
    }

    public async Task<string> CreateQuizAsync(Quiz quiz)
    {
        quiz.Id = $"quiz_{_quizzes.Count + 1}_{System.Guid.NewGuid().ToString().Substring(0, 4)}";
        _quizzes.Add(quiz);
        return await Task.FromResult(quiz.Id);
    }
    
    public async Task UpdateQuizAsync(string id, Quiz updatedQuiz)
    {
        var quiz = _quizzes.FirstOrDefault(q => q.Id == id);
        if (quiz != null)
        {
            quiz.Question = updatedQuiz.Question;
            quiz.Options = updatedQuiz.Options;
            quiz.CorrectAnswerIndex = updatedQuiz.CorrectAnswerIndex;
            quiz.Explanation = updatedQuiz.Explanation;
            quiz.Difficulty = updatedQuiz.Difficulty;
            quiz.BloomTag = updatedQuiz.BloomTag;
        }
        await Task.CompletedTask;
    }

    public async Task DeleteQuizAsync(string id)
    {
        _quizzes.RemoveAll(q => q.Id == id);
        await Task.CompletedTask;
    }

    // --- BADGES ---
    public async Task<List<Badge>> GetAllBadgesAsync() => await Task.FromResult(_badges);

    public async Task CreateBadgeAsync(Badge badge) { 
        badge.Id = $"badge{_badges.Count + 1}";
        _badges.Add(badge); 
        await Task.CompletedTask; 
    }
}