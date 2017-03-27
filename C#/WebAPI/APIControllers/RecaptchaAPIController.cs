using bringpro.Web.Models.Requests;
using bringpro.Web.Models.Responses;
using bringpro.Web.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

//for google recaptcha API.
namespace bringpro.Web.Controllers.Api
{
    [RoutePrefix("api/captcha")]
    public class RecaptchaApiController : ApiController
    {
        [Route(),HttpPost]
        public HttpResponseMessage sendCaptcha (RecaptchaRequest model)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            ItemResponse<bool> response = new ItemResponse<bool>();

          string  key = model.secret;
          string  request = model.response;

            bool isCaptchaValid = RecaptchaService.Validate(request, key);
            response.Item = isCaptchaValid;

            return Request.CreateResponse(HttpStatusCode.OK, response);
        }
    }
}
