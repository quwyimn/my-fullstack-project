// backend-aspnet/Services/InMemoryDataService.cs
using backend_aspnet.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend_aspnet.Services;

public class InMemoryDataService
{
    private static List<Stage> _stages;
    private static List<Quiz> _quizzes;
    private static List<User> _users;

    // Sử dụng static constructor để khởi tạo dữ liệu một lần duy nhất
    static InMemoryDataService()
    {
        // 1. Khởi tạo Stages và Quizzes trước
        _stages = MockDataService.GetMockStages();
        _quizzes = MockDataService.GetAllMockQuizzes();

        // 2. Lấy ra tất cả các Stage ID
        var allStageIds = _stages
            .Select(s => s.Id) 
            .Where(id => id != null)
            .Select(id => id!) 
            .ToList(); 
        // 3. Khởi tạo Users, gán tất cả Stage ID cho Admin
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
                CompletedStages = new List<string> { "stage1" } 
            },
            new User 
            { 
                Id = "user-admin-1", 
                Username = "admin", 
                Email = "admin@algo.com", 
                Password = BCrypt.Net.BCrypt.HashPassword("admin123"), 
                Role = "Admin", 
                Xp = 9999, 
                CompletedStages = allStageIds // <-- GÁN TẤT CẢ ID VÀO ĐÂY
            }
        };
    }

    // Các hàm CRUD bây giờ sẽ thao tác trên các List static đã được khởi tạo
    public async Task<List<User>> GetAllUsersAsync() => await Task.FromResult(_users);
    public async Task<User?> GetUserByEmailAsync(string email) => await Task.FromResult(_users.FirstOrDefault(u => u.Email == email));
    public async Task<User?> GetUserByIdAsync(string id) => await Task.FromResult(_users.FirstOrDefault(u => u.Id == id));
    
    public async Task<string> CreateUserAsync(User user)
    {
        user.Id = $"user_{_users.Count + 1}_{System.Guid.NewGuid().ToString().Substring(0, 4)}";
        _users.Add(user);
        return await Task.FromResult(user.Id);
    }

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
        }
        await Task.CompletedTask;
    }

    public async Task DeleteStageAsync(string id)
    {
        _stages.RemoveAll(s => s.Id == id);
        _quizzes.RemoveAll(q => q.StageId == id);
        await Task.CompletedTask;
    }

    public async Task<List<Quiz>> GetQuizzesByStageIdAsync(string stageId)
    {
        return await Task.FromResult(_quizzes.Where(q => q.StageId == stageId).ToList());
    }

    public async Task CreateQuizAsync(Quiz quiz)
    {
        quiz.Id = $"quiz_{_quizzes.Count + 1}_{System.Guid.NewGuid().ToString().Substring(0, 4)}";
        _quizzes.Add(quiz);
        await Task.CompletedTask;
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
        }
        await Task.CompletedTask;
    }

    public async Task DeleteQuizAsync(string id)
    {
        _quizzes.RemoveAll(q => q.Id == id);
        await Task.CompletedTask;
    }
}