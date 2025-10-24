using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend_aspnet.Models;

[BsonIgnoreExtraElements]
public class Stage
{
    [BsonId]
    public string? Id { get; set; }

    [BsonElement("name")]
    public string Name { get; set; } = null!;

    [BsonElement("description")]
    public string Description { get; set; } = null!;

    [BsonElement("difficulty")]
    public string Difficulty { get; set; } = "Dễ";

    [BsonElement("backgroundUrl")]
    public string BackgroundUrl { get; set; } = null!;
    
    [BsonElement("order")]
    public int Order { get; set; }

    [BsonIgnore] 
    public List<Quiz> Quizzes { get; set; } = new List<Quiz>();
}