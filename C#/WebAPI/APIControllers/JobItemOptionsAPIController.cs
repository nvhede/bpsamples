using Microsoft.Practices.Unity;
using bringpro.Web.Domain;
using bringpro.Web.Models;
using bringpro.Web.Models.Requests;
using bringpro.Web.Models.Responses;
using bringpro.Web.Services;
using bringpro.Web.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace bringpro.Web.Controllers.Api
{
    [RoutePrefix ("api/jobitemoptions")]
    public class JobItemOptionsApiController : ApiController
    {
        [Dependency]
        public IJobItemOptionsService _OptionsService { get; set; }

        //postJobItemOptions: sends a POST call to the database and logs in new entry.
        [Route, HttpPost]
        public HttpResponseMessage postJobItemOptions (JobItemOptionsInsertRequest model)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            ItemResponse<int> response = new ItemResponse<int>();

            int jobitemoptionID = _OptionsService.postJobItemOptions(model);
            response.Item = jobitemoptionID;
            return Request.CreateResponse(HttpStatusCode.OK, response);
        }

        //getIdJobItemOptions: sends a GET call to the db and recieves an entry based on ID.
        [Route("{id:int}"), HttpGet]
        public HttpResponseMessage getIdJobItemOptions (int id)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            JobItemOptionsDomain jobList = _OptionsService.getIdJobItemOptions(id);
            ItemResponse<JobItemOptionsDomain> response = new ItemResponse<JobItemOptionsDomain>();
            response.Item = jobList;
            return Request.CreateResponse(HttpStatusCode.OK, response);
        }

        //getAllJobItemOptoins: sends a GET call to the db and recieves all entries.
        [Route(), HttpGet]
        public HttpResponseMessage getAllJobItemOptions()
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }


            List<JobItemOptionsDomain> jobList = _OptionsService.getAllJobItemOptions();
            ItemsResponse<JobItemOptionsDomain> response = new ItemsResponse<JobItemOptionsDomain>();
            response.Items = jobList;
            return Request.CreateResponse(HttpStatusCode.OK, response);
        }

        //updateJobItemOptions: sends a PUT call to the db and updates an entry based on its ID.

        [Route("{id:int}"), HttpPut]
        public HttpResponseMessage updateJobItemOptions (JobItemOptionsUpdateRequest model)
        {
           if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }


            bool isSuccessful = _OptionsService.updateJobItemOptions(model);
            ItemResponse<bool> response = new ItemResponse<bool>();
            response.Item = isSuccessful;
            return Request.CreateResponse(HttpStatusCode.OK, response);
        }

        //deleteJobItemOptions: sends a DELETE call to the db and deletes an entry based on its ID.
        [Route("{id:int}"), HttpDelete]
        public HttpResponseMessage deleteJobItemOptions (int id)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }


            JobItemOptionsDeleteRequest model = new JobItemOptionsDeleteRequest();
            model.Id = id;

            bool isSuccessful = _OptionsService.deleteJobItemOptions(model);
            ItemResponse<bool> response = new ItemResponse<bool>();
            response.Item = isSuccessful;

            return Request.CreateResponse(HttpStatusCode.OK, response);
        }
    }
}
