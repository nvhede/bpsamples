using bringpro.Web.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace bringpro.Web.Controllers
{
    [RoutePrefix("jobitems")]
    public class JobItemOptionsController : Controller
    {

        // Admin site
        [Route("admin")]
        public ActionResult Admin()
        {
            return View("AdminNg");
        }

        //manage and create
        [Route("manage/{id:int}")]
        [Route("create")]
        public ActionResult JobItemOptionsForm(int? id)
        {
            ItemViewModel<int?> model = new ItemViewModel<int?>();
            model.Item = id;
            return View("JobItemOptionsFormNg", model);
        }
    }
}
