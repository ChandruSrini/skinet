using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Errors;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("errors/{code}")]
    //for now to show swagger ApiExplorerSettings
    [ApiExplorerSettings(IgnoreApi = true)]
    public class ErrorController: BaseApiController
    {
        public IActionResult Error(int code)
        {
            //app.UseStatusCodePagesWithReExecute("/errors/{0}"); in startup
            return new ObjectResult(new ApiResponse(code));
        }
    }
}