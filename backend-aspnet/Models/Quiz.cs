// backend-aspnet/Models/Quiz.cs

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend_aspnet.Models;

[BsonIgnoreExtraElements]
public class Quiz
{
    [BsonId]
    public string? Id { get; set; }

    [BsonElement("stageId")]
    public string StageId { get; set; } = null!;

    [BsonElement("question")]
    public string Question { get; set; } = null!;

    [BsonElement("options")]
    public List<string> Options { get; set; } = null!;

    [BsonElement("correctAnswerIndex")]
    public int CorrectAnswerIndex { get; set; }

    [BsonElement("explanation")]
    public string Explanation { get; set; } = "";

    [BsonElement("difficulty")]
    public string Difficulty { get; set; } = "Dễ";
}