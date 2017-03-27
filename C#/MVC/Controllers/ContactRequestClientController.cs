using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using bringpro.Web.Models.ViewModels;
using bringpro.Web.Services;

namespace bringpro.Web.Controllers
{
    [RoutePrefix("contact_us")]
    public class ContactRequestController : BaseController
    {
        // GET: ContactRequest
        [Route("index")]
        [Route]
        public ActionResult Index()
        {
            ItemViewModel<string> vm = new ItemViewModel<string>();
            vm.Item = ConfigService.RecaptchaKey;
            return View("IndexNg", vm);
        }

        //SUCCESS: if form successfully submitted.
        [Route("index/success")]
        [Route ("success")]
        public ActionResult IndexSuccess()
        {
            return View();
        }
    }
}
