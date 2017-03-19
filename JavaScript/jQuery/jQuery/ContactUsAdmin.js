
@section Scripts {
<script src="~/Assets/App/Services/bringpro.services.contactrequest.js"></script>
    <script src="~/Assets/Themes/Material-Admin/vendors/bower_components/bootstrap-sweetalert/lib/sweet-alert.min.js"></script>

    <script type="text/javascript">
        //global variables:
        bringpro.page.crTable //for getting the specific entry.
        bringpro.page.contactRequestInputID //for storing the ID.

        //getAllCRSuccess: retrieves all the Contact Request entries that are not spam from the DB and renders them.
        bringpro.page.handlers.getAllCRSuccess = function (data) {
            event.preventDefault();
            var array = data.items;
            if (typeof array === "object" && array.length > 0) {
                for (var i = 0; i < array.length; i++) {
                    var CRTemplate = $($("#contactrequest-template").html()).clone();

                    var inputID = array[i].id;
                    var inputName = array[i].name;
                    var inputEmail = array[i].email;
                    var inputSubject = array[i].subject;
                    //var inputUserID = array[i].userID;
                    //var inputStatus = array[i].status;
                    var inputDate = array[i].dateCreated;
                    var localInputDate = new Date(inputDate).toLocaleString();

                    $(CRTemplate).find(".id").html(inputID);
                    $(CRTemplate).find(".name").html(inputName);
                    $(CRTemplate).find(".email").html(inputEmail);
                    $(CRTemplate).find(".subject").html(inputSubject);
                    //$(CRTemplate).find('.userID').html(inputUserID);
                    //$(CRTemplate).find(".status").html(inputStatus);
                    $(CRTemplate).find(".dateAdded").html(localInputDate);


                    //$(CRTemplate).find(".CRInfo").attr('href', '/admin/manage/' + inputID);

                    //if (inputUserID == null) {
                    //    $(CRTemplate).find(".userID").text("Not Available");
                    //}

                    //else {
                    //    $(CRTemplate).find('.userID').html(inputUserID);
                    //}
                    $('.tableTop').prepend(CRTemplate);
                }
            }
        };

        //crInfoModal: triggers modal displaying info
        bringpro.page.handlers.crInfoModal = function () {
            crTable = $(this).closest('.crtable');
            bringpro.page.contactRequestInputID = $(crTable).find('.id').text();
            console.log(bringpro.page.contactRequestInputID);
            bringpro.services.contactrequest.getInfoByID(bringpro.page.contactRequestInputID, bringpro.page.handlers.crInfoModalSuccess, bringpro.page.handlers.logError);
        };

        //crInfoModalSuccess: gets info of specific entry and triggers modal.
        bringpro.page.handlers.crInfoModalSuccess = function (data) {
            $('#crModal').modal('show');

            console.log(data);

            $('#crModal').find('#name').html(data.item.name);
            $('#crModal').find('#userID').html(data.item.userID);
            $('#crModal').find('#email').html(data.item.email);
            $('#crModal').find('#subject').html(data.item.subject);
            $('#crModal').find('#message').html(data.item.message);
            $('#crModal').find('#status').html(data.item.status);
        };

        //logError: console.logs the error.
        bringpro.page.handlers.logError = function (error) {
            console.log("Error!", error);
        };

        //crDeleteModal: triggers modal confirmation if you want to delete
        bringpro.page.handlers.crDeleteModal = function () {
            swal({
                title: "Are you sure you want to delete this?",
                text: "This contact request will be permanently deleted.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false,
                closeOnCancel: false,
                html: false
            }, function (isDeleted) {
                if (isDeleted) {
                    bringpro.page.handlers.fadeCR();
                    bringpro.services.contactrequest.delete(bringpro.page.contactRequestInputID, bringpro.page.handlers.deleteCRSuccess, bringpro.page.handlers.logError);
                    swal("Deleted!",
                    "This contact request has been deleted.",
                    "success");
                }
                else {
                    swal("Cancelled",
                        "Contact Request is safe",
                        "error");
                }
            });
        };

        //deleteContactRequest: deletes the specific Contact Request from the DB upon click.
        bringpro.page.handlers.deleteContactRequest = function () {
            crTable = $(this).closest('.crtable');
            bringpro.page.contactRequestInputID = $(crTable).find('.id').text();
            console.log(bringpro.page.contactRequestInputID);
            bringpro.page.handlers.crDeleteModal();
        };

        //deleteCRSuccess: console logs deletion sucess, refreshes page.
        bringpro.page.handlers.deleteCRSuccess = function (id) {
            console.log("Deletion of Contact Request form was a success.");
        };

        //crResetSpamModal: triggers modal confirmation if you want to spam
        bringpro.page.handlers.setSpamModal = function () {
            swal({
                title: "Are you sure you want to spam this?",
                text: "This contact request will be sent to the Spam box.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, spam it!",
                closeOnConfirm: false,
                closeOnCancel: false,
                html: false
            }, function (isDeleted) {
                if (isDeleted) {
                    bringpro.page.handlers.fadeCR();
                    bringpro.services.contactrequest.setSpam(bringpro.page.contactRequestInputID, bringpro.page.handlers.resetSpamCRSuccess, bringpro.page.handlers.logError);
                    swal("Spammed!",
                    "This contact request has been spammed.",
                    "success");
                }
                else {
                    swal("Cancelled",
                        "Contact Request is safe!",
                        "error");
                }
            });
        };

        //setSpamCR: triggers the setSpam AJAX PUT call, converting entry to a Spam entry. console logs the ID.
        bringpro.page.handlers.setSpamCR = function () {
            crTable = $(this).closest('.crtable');
            bringpro.page.contactRequestInputID = $(crTable).find('.id').text();
            console.log(bringpro.page.contactRequestInputID);
            bringpro.page.handlers.setSpamModal();
        };

        //setSpamCRSuccess: console logs spam conversion a success, and refreshes page.
        bringpro.page.handlers.setSpamCRSuccess = function (id) {
            console.log("Spam of Contact Request form was a success.");
        };

        //fadeCR: upon deletion/spamming/unspamming, removes specific entry from the page.
        bringpro.page.handlers.fadeCR = function () {
            console.log(crTable);
            $(crTable).fadeOut(100);
        };

        //filterTable: searches through table from search bar.
        bringpro.page.handlers.filterTable = function () {
            var filter = $(this);
            $.each($("table tbody tr"), function () {
                if ($(this).text().toLowerCase().indexOf(filter.val().toLowerCase()) === -1) {
                    $(this).hide();
                }
                else {
                    $(this).show();
                }
            });
        };

        //goToCrSpam: triggers link to Spam view
        bringpro.page.handlers.goToCrSpam = function () {
            location.href = "/Admin/Index/Spam";
        };


        bringpro.page.startUp = function () {
            bringpro.services.contactrequest.getAll(bringpro.page.handlers.getAllCRSuccess, bringpro.page.handlers.logError);
            $(document).on('click', '.CRDelete', bringpro.page.handlers.deleteContactRequest);
            $("#mySearchInput").on('keyup', bringpro.page.handlers.filterTable);
            $(document).on('click', '.CRSpam', bringpro.page.handlers.setSpamCR);
            $(document).on('click','.CRInfo', bringpro.page.handlers.crInfoModal);
            $('#spamLinkButton').on('click', bringpro.page.handlers.goToCrSpam);

        };



    </script>
}
