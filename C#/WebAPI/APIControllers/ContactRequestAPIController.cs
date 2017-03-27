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

//List of Contact Request API Controllers
namespace bringpro.Web.Controllers.Api
{
    [RoutePrefix("api/contact")]
    public class ContactRequestApiController : ApiController
    {
        [Dependency]
        public IUserEmailService _EmailService { get; set; }

        [Dependency]
        public IContactRequestService _ContactService { get; set; }

        [Route, HttpPost]
        //postContactUs: sends AJAX POST input to the Service, and retrieves the ID for output.
        //creates an automated email to the Contact Request's email address.
        public HttpResponseMessage postContactUs(PostContactRequest model)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            ItemResponse<int> response = new ItemResponse<int>();

            ContactRequestServices contactService = new ContactRequestServices();

            int tempBlogID = contactService.postContactRequest(model);

            response.Item = tempBlogID;

            EmailRequestModel crModel = new EmailRequestModel();

            crModel.Email = model.Email;
            crModel.Name = model.Name;

            _EmailService.sendContactRequestEmail(crModel);

            return Request.CreateResponse(HttpStatusCode.OK, response);

        }

        [Route("{id:int}"), HttpGet]
        //GetIDContactUs: using an int ID parameter, retrieves the Contact Request input in the form of an array.
        public HttpResponseMessage getIDContactUs (int id)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
            ContactRequest CRList = _ContactService.getContactRequestByID(id);
            ItemResponse<ContactRequest> response = new ItemResponse<ContactRequest>();

            response.Item = CRList;

            return Request.CreateResponse(HttpStatusCode.OK, response);
        }

        //getAllContactRequests: retrieves all Contact Requests from DB.
        [Route,HttpGet]
        public HttpResponseMessage getAllContactRequests()
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, ModelState);
            }

            ItemsResponse<ContactRequest> response = new ItemsResponse<ContactRequest>();

            ContactRequestServices crService = new ContactRequestServices();

            List<ContactRequest> crList = _ContactService.getAllContactRequests();

            response.Items = crList;

            return Request.CreateResponse(HttpStatusCode.OK, response);
        }

        //deleteIDContactUs: deletes a Contact Request entry by ID.
        [Route("{id:int}"), HttpDelete]
        public HttpResponseMessage deleteIDContactUs (int id)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            DeleteContactRequest model = new DeleteContactRequest();

            model.id = id;

            ContactRequestServices contactService = new ContactRequestServices();

            bool isSuccessful = _ContactService.deleteContactRequest(model);

            ItemResponse<bool> response = new ItemResponse<bool>();

            response.Item = isSuccessful;

            return Request.CreateResponse(HttpStatusCode.OK, response);
        }

        //getSpamContactUs: retrieves all spammed Contact Requests from DB.
        [Route("spam"),HttpGet]
        public HttpResponseMessage getSpamContactUs()
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            ItemsResponse<ContactRequest> response = new ItemsResponse<ContactRequest>();

            List<ContactRequest> crList = _ContactService.getContactRequestSpam();

            response.Items = crList;

            return Request.CreateResponse(HttpStatusCode.OK, response);

        }

        //setSpam: updates the Spam value to "True" in the database.
        [Route("spam/{id:int}"), HttpPut]
        public HttpResponseMessage setSpam(int id)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }


            ContactRequestServices crService = new ContactRequestServices();

            bool isSuccessful = _ContactService.setSpam(id);

            ItemResponse<bool> response = new ItemResponse<bool>();

            response.Item = isSuccessful;

            return Request.CreateResponse(HttpStatusCode.OK, response);

        }

        //resetSpam: updates the Spam value to "False" in the database.
        [Route("unspam/{id:int}"),HttpPut]
        public HttpResponseMessage resetSpam (int id)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            ContactRequestServices crService = new ContactRequestServices();

            bool isSuccessful = _ContactService.resetSpam(id);

            ItemResponse<bool> response = new ItemResponse<bool>();

            response.Item = isSuccessful;

            return Request.CreateResponse(HttpStatusCode.OK, response);
        }
    }
}
