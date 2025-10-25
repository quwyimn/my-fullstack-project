using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend_aspnet.Models;

[BsonIgnoreExtraElements]
public class User
{
    [BsonId]
    public string? Id { get; set; }

    [BsonElement("username")]
    public string Username { get; set; } = null!;

    [BsonElement("email")]
    public string Email { get; set; } = null!;

    [BsonElement("password")]
    public string Password { get; set; } = null!;

    [BsonElement("xp")]
    public int Xp { get; set; }

    [BsonElement("level")]
    public int Level { get; set; } = 1;

    [BsonElement("badges")]
    public List<string> Badges { get; set; } = new List<string>();

    [BsonElement("role")]
    public string Role { get; set; } = "Player";

    [BsonElement("completedStages")]
    public List<string> CompletedStages { get; set; } = new List<string>();
    public List<string> BadgeIds { get; set; } = new List<string>();
}