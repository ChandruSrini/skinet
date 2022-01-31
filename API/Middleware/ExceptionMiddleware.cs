using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using API.Errors;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;

        //this is to handle 500 internal server error, middleware
        //RequestDelegate used to process HttpRequest
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                // if no exception request moves on to next stage
                await _next(context);
            }
            catch (Exception ex)
            {
                
                _logger.LogError(ex, ex.Message);
                // to convert to JSON format
                context.Response.ContentType = "application/json";
                //set StatusCode to 500 internal server error 
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                //based on environment is dev or not
                var response = _env.IsDevelopment()
                    ? new ApiException((int)HttpStatusCode.InternalServerError, ex.Message, ex.StackTrace.ToString())
                    : new ApiException((int)HttpStatusCode.InternalServerError);

                var options = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};

                // to json
                var json = JsonSerializer.Serialize(response, options);
                await context.Response.WriteAsync(json); 

            }
        }
    }
}