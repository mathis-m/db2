using System.Text.Json;
using System.Text.Json.Serialization;
using MongoDB.Bson;

namespace TodoApi.JsonConverters;

public class JsonObjectIdConverter : JsonConverter<ObjectId>
{
    public override ObjectId Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        return new(JsonSerializer.Deserialize<string>(ref reader, options));
    }

    public override void Write(Utf8JsonWriter writer, ObjectId value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value.ToString());
    }
}