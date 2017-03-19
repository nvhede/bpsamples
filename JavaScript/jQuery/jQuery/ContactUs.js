
<!-- SCRIPTS BEGIN HERE -->
@section Scripts {

<script src="~/Assets/App/Services/bringpro.services.contactrequest.js"></script>
    <script type="text/javascript">
        //GLOBAL VARIABLES: contactID

        bringpro.page.contactID = null;

        //HANDLERS: submitForm, contactRequestGetFormSuccess, contactRequestPostSuccess, logError, initializeValidation, validateForm

        //submitForm: inputs values of Contact Request form to an AJAX POST call and returns an ID before clearing form.
        bringpro.page.handlers.submitForm = function () {
            var inputName = $('#inputName').val();
            var inputEmail = $('#inputEmail').val();
            var inputSubject = $('#inputSubject').val();
            var inputMessage = $('#inputMessage').val();

            $('#inputName').val("");
            $('#inputEmail').val("");
            $('#inputSubject').val("");
            $('#inputMessage').val("");

            var APIdata = {
                'Name': inputName,
                'Email': inputEmail,
                'Subject': inputSubject,
                'Message': inputMessage
            };

            bringpro.services.contactrequest.post(APIdata, bringpro.page.handlers.contactRequestPostSuccess, bringpro.page.handlers.logError);



        };

        //contactRequestGetFormSuccess: console logs the Contact Request form inputs in the form of an array.
        bringpro.page.handlers.contactRequestGetFormSuccess = function (data) {
            console.log(data.item);
            console.log("Contact Request data here.");

        };

        //contactRequestPostSuccess: console logs the ID of the Contact Request form and runs an AJAX GET call.
        bringpro.page.handlers.contactRequestPostSuccess = function (id) {
            console.log("Contact Request Form post was a success");
            console.log(id);
            bringpro.page.contactID = id.item;

           location.href = "/contact_us/success"
        };

        //logError: console logs the error if AJAX call does not pass successfully.
        bringpro.page.handlers.logError = function (error) {
            console.log("Error!", error);
        };

        //initializeValidation: validates our Contact Request form so that user cannot improperly add Name/Email.
        bringpro.page.handlers.initializeValidation = function () {
            console.log("Validating has begun!");
            jQuery.validator.setDefaults({
                debug: true
            });
            $("#contactRequestForm").validate({
                errorElement: "small",
                errorClass: "help-block",
                errorPlacement: bringpro.layout.errorPlacement,
                success: bringpro.layout.validateSuccess,
                rules: {
                    'inputName': { required: true },
                    'inputEmail': { required: true, email: true },
                    'inputMessage': {required: true}
                },
                messages: {
                    'inputName': { required: 'Please enter a name.' },
                    'inputEmail': {
                        required: 'An email address is required.',
                        email: "Your email address must bein the form of name@domain.com",
                    },
                    'inputMessage': {required: "Please send us some feedback!"}
                }
            });
        };

        //captureCaptcha: upon completion of captcha, sends a request to Google API for validation/confirmation.
        bringpro.page.handlers.captureCaptcha = function () {
            var captcha_response = grecaptcha.getResponse();
            if (captcha_response.length == 0)
                return false;
            else
                return true;
        };

        //validateForm: submits Contact Request form and directs you to a Submitted page if passes validation
        bringpro.page.handlers.validateForm = function (event) {
            event.preventDefault();
            var validatedCaptcha = bringpro.page.handlers.captureCaptcha();
            if ($("#contactRequestForm").valid() && validatedCaptcha == true)
            {
                bringpro.page.handlers.submitForm();

            }
            else { }
        };

        bringpro.page.startUp = function () {
            console.log("Starting up!");
            bringpro.page.handlers.initializeValidation();
            $("#CRSubmit").on('click', bringpro.page.handlers.validateForm);
        }

    </script>
}
