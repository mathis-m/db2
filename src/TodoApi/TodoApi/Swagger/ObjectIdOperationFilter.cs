using System.ComponentModel;
using System.Reflection;
using System.Xml.XPath;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using MongoDB.Bson;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace TodoApi.Swagger
{
    public class ObjectIdOperationFilter : IOperationFilter
    {
        //prop names we want to ignore
        private readonly IEnumerable<string> _objectIdIgnoreParameters = new[]
        {
            "Timestamp",
            "Machine",
            "Pid",
            "Increment",
            "CreationTime"
        };

        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            //for very parameter in operation check if any fields we want to ignore
            //delete them and add ObjectId parameter instead
            foreach (var p in operation.Parameters.ToList())
                if (_objectIdIgnoreParameters.Any(x => p.Name.EndsWith(x)))
                {
                    var parameterIndex = operation.Parameters.IndexOf(p);
                    operation.Parameters.Remove(p);
                    var dotIndex = p.Name.LastIndexOf(".", StringComparison.Ordinal);
                    if (dotIndex <= -1) continue;
                    var idName = p.Name[..dotIndex];
                    if (operation.Parameters.All(x => x.Name != idName))
                    {
                        operation.Parameters.Insert(parameterIndex, new OpenApiParameter()
                        {
                            Name = idName,
                            Schema = new OpenApiSchema()
                            {
                                Type = "string",
                                Format = "24-digit hex string"
                            },
                            Example = new OpenApiString(ObjectId.Empty.ToString()),
                            In = p.In,
                        });
                    }
                }
        }
    }
}