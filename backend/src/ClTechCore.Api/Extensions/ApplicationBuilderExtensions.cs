using ClTechCore.Api.Middleware;
using Microsoft.AspNetCore.Builder;

namespace ClTechCore.Api.Extensions
{
    public static class ApplicationBuilderExtensions
    {
        public static IApplicationBuilder UseApiExceptionHandling(this IApplicationBuilder app)
        {
            return app.UseMiddleware<ExceptionMiddleware>();
        }
    }
}
