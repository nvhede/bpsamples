using RazorEngine;
using RazorEngine.Templating;
using bringpro.Web.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Hosting;
using System.Web.Mvc;

namespace bringpro.Web.Services
{
    public static class EmailService
    {
        public static string RenderRazorViewToString(string viewName, EmailRequestModel model)
        {
            var path = HostingEnvironment.MapPath(viewName);
            var viewRaw = File.ReadAllText(path);

            var key = new NameOnlyTemplateKey("EmailReply", ResolveType.Global, null);
            Engine.Razor.AddTemplate(key, new LoadedTemplateSource(viewRaw));
            StringBuilder sb = new StringBuilder();
            using (StringWriter sw = new StringWriter(sb))
                Engine.Razor.RunCompile(key, sw, null, model);
            {
                return sb.ToString();
            }

        }
    }
}
