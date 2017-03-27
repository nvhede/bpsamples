using bringpro.Web.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace bringpro.Web.Controllers
{
    [RoutePrefix("admin")]
    public class ContactRequestAdminController : BaseController
    {
        // GET: ContactRequestAdmin
        [Route("index")]
        public ActionResult Index()
        {
            return View("IndexNg");
        }

        //For total admin page
        [Route("manage/{id:int}")]
        public ActionResult Edit(int? id = null)
        {
            ItemViewModel<int?> data = new ItemViewModel<int?>();
            data.Item = id;
            return View(data);
        }

        //for spam page.
        [Route("index/spam")]
        public ActionResult Spam()
        {
            return View("SpamNg");
        }
    }
