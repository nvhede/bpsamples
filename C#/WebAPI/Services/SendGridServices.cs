using bringpro.Data;
using bringpro.Web.Domain;
using bringpro.Web.Models;
using bringpro.Web.Services.Interfaces;
using SendGrid;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net.Mail;
using System.Web;
using System.Threading.Tasks;
using bringpro.Web.Models.Requests.Tests;

namespace bringpro.Web.Services
{
    public class SendGridService : BaseService, IUserEmailService
    {
        // SendGrid email service plugin (using older version 6)
        public void SendProfileEmail(Guid? Token, string Email)
        {

            SendGridMessage ActivateUserEmail = new SendGridMessage();
            ActivateUserEmail.AddTo(Email);
            ActivateUserEmail.From = new MailAddress("edmundpark86@gmail.com");
            ActivateUserEmail.Subject = "Activate your BringPro account.";
            //Need to change the URL below later
            //ActivateUserEmail.Text = "Click this link to activate your account " + "http://localhost:1552/public/authentication/" + Token;

            //Original Activate with Correct Url
            ActivateUserEmail.Text = "Click this link to activate your account " + ConfigService.SiteBaseUrl + "/public/authentication/" + Token;

            // Api Key provided by bringpro
            var transportWeb = new SendGrid.Web(ConfigService.SendGridWebKey);

            transportWeb.DeliverAsync(ActivateUserEmail);
        }


        public void SendAdminProfileEmail(Guid? Token, string Email)
        {

            SendGridMessage ActivateUserEmail = new SendGridMessage();
            ActivateUserEmail.AddTo(Email);
            ActivateUserEmail.From = new MailAddress(ConfigService.SupportEmail);
            ActivateUserEmail.Subject = "Activate your BringPro account.";
            //Need to change the URL below later
            //ActivateUserEmail.Text = "Click this link to activate your account " + "http://localhost:1552/public/authentication/" + Token;

            //Original Activate with Correct Url
            ActivateUserEmail.Text = "Click this link to activate your account " + ConfigService.BackOfficeBaseUrl + "/authentication/" + Token;
            //ActivateUserEmail.Text = "Click this link to activate your account " + "http://bringpro.dev/backoffice/authentication/" + Token;

            // Api Key provided by bringpro
            var transportWeb = new SendGrid.Web(ConfigService.SendGridWebKey);

            transportWeb.DeliverAsync(ActivateUserEmail);
        }


        //sends automated email through Contact Request's email address and rendered HTML string.
        public void sendContactRequestEmail(EmailRequestModel crModel)
        {

            string renderedHTML = EmailService.RenderRazorViewToString("~/Views/TestEmail/Index.cshtml", crModel);

            SendGridMessage ActivateCrEmail = new SendGridMessage();
            ActivateCrEmail.AddTo(crModel.Email);
            ActivateCrEmail.From = new MailAddress("nvhede@gmail.com");
            ActivateCrEmail.Html = renderedHTML;
            ActivateCrEmail.Subject = "Your BringPro input has been successfully submitted!";
            //ActivateCrEmail.Text = "We appreciate your feedback and will contact you within a few days for support.";
            var sendGridKey = new SendGrid.Web(ConfigService.SendGridWebKey);
            sendGridKey.DeliverAsync(ActivateCrEmail);

        }

        public void ResetPasswordEmail(Guid Token, string Email, string Slug)
        {

            SendGridMessage GetNewPassword = new SendGridMessage();
            GetNewPassword.AddTo(Email);
            GetNewPassword.From = new MailAddress(ConfigService.SupportEmail);
            GetNewPassword.Subject = "Reset your bringpro password.";
            //Need to change the URL below later
            GetNewPassword.Text = "Click this link to reset your password: " + "http://bringpro.dev" + "/" + Slug + "/passwordauthentication/" + Token; //<<<<<<CHANGE BACK TO THIS when you are done testing>>>> GetNewPassword.Text = "Click this link to reset your password: " + ConfigService.SiteBaseUrl  + "/" + Slug + "/passwordauthentication/" + Token;

            // Api Key provided by bringpro
            var transportWeb = new SendGrid.Web(ConfigService.SendGridWebKey);

            transportWeb.DeliverAsync(GetNewPassword);
        }

        //sending out referral code with user specific referral codes -Anna
        public void ReferralEmail(Guid Token, string Email)
        {

            SendGridMessage SendReferral = new SendGridMessage();

            SendReferral.AddTo(Email);
            SendReferral.From = new MailAddress(ConfigService.SupportEmail);
            SendReferral.Subject = "Invitation to try bringpro";
            SendReferral.Text = "Your friend has invited you to try bringpro. Use their referral code to get 25% off your first order!" + ConfigService.SiteBaseUrl  + "/Public/referralRegister/" + Token;

            var transportWeb = new SendGrid.Web(ConfigService.SendGridWebKey);
            transportWeb.DeliverAsync(SendReferral);

        }

        public void SendEmail()
        {
            throw new NotImplementedException();
        }

        public void SendEmail(MandrillRequestModelTest model)
        {
            throw new NotImplementedException();
        }

        //Sending out an email when a user is created in the admin create users tab in the backoffice:
        public void BackofficeCreateUserEmail(string Email)
        {


                SendGridMessage register = new SendGridMessage();
                register.AddTo(Email);
                register.From = new MailAddress(ConfigService.SupportEmail);
                register.Subject = "Reset your bringpro password.";
                //Need to change the URL below later
                register.Text = "Click this link to register your account with bringpro: " + "http://bringpro.dev/backoffice#/login";

                // Api Key provided by bringpro
                var transportWeb = new SendGrid.Web(ConfigService.SendGridWebKey);

                transportWeb.DeliverAsync(register);

        }
    }
}
