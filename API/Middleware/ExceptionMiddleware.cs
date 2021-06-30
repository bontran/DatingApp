using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Hosting;
using System;
using System.Threading.Tasks;
using System.Net;
using API.Errors;
using System.Text.Json;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        //what's coming up next in the middleware pipeline
        //Ilogger logout in terminal
        private readonly RequestDelegate _next;
        private readonly IHostEnvironment _env;
        private readonly ILogger<ExceptionMiddleware> _logger;
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger,
        IHostEnvironment env)
        {
            this._env = env;
            this._logger = logger;
            this._next = next;

        }
        //because this happen in context of an http request when add middleware 
        //where we have access to http request
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                //get context pass to piece of middleware
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                var response = _env.IsDevelopment()
                    ? new ApiException(context.Response.StatusCode, ex.Message, ex.StackTrace?.ToString())
                    : new ApiException(context.Response.StatusCode, "Internal Server Error");

                var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

                var json = JsonSerializer.Serialize(response, options);

                await context.Response.WriteAsync(json);
            }
        }
    }
}