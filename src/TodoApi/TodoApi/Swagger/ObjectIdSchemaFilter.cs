using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using MongoDB.Bson;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace TodoApi.Swagger
{
    public class ObjectIdSchemaFilter : ISchemaFilter
    {
        public void Apply(OpenApiSchema schema, SchemaFilterContext context)
        {
            if (context.Type != typeof(ObjectId)) return;
            schema.Type = "string";
            schema.Format = "24-digit hex string";
            schema.Example = new OpenApiString(ObjectId.Empty.ToString());
            schema.Properties = null;
        }
    }
}
