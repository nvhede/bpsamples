@section Scripts {
    <script src="~/Assets/App/Services/bringpro.services.contactrequest.js"></script>


    <script type="text/javascript">


        //controller
        (function () {
            "use strict";

            angular.module(APPNAME)
                .controller("crAdminController", crAdminController);

            crAdminController.$inject = ['$scope', '$baseController', '$crAdminService', '$uibModal'];

            function crAdminController($scope, $baseController, $crAdminService, $uibModal) {
                var vm = this;
                vm.selectedCr = null;
                vm.items = null;
                vm.crId = null;
                vm.modalSelected = null;

                vm.$scope = $scope;
                vm.$crAdminService = $crAdminService;
                vm.$uibModal = $uibModal;

                vm.recieveCr = _recieveCr;
                vm.selectCr = _selectCr;
                vm.onError = _onError;
                vm.deleteCr = _deleteCr;
                vm.resetSpamCr = _resetSpamCr;
                vm.deleteSuccess = _deleteSuccess;
                vm.resetSpamSuccess = _resetSpamSuccess;
                vm.goTo = _goTo;
                vm.openModal = _openModal;

                $baseController.merge(vm, $baseController);
                vm.notify = vm.$crAdminService.getNotifier($scope);

                render();

                function render() {
                    vm.$crAdminService.getAllSpam(vm.recieveCr, vm.onError);
                }

                function _goTo(link) {
                    location.href = link;
                }

                function _openModal(cr) {
                    var modalInstance = vm.$uibModal.open({
                        animation: true,
                        backdrop: true,
                        templateUrl: 'crModal.html',
                        controller: 'modalController as m',
                        size: 'med',
                        resolve: {
                            contactrequest: function () {
                                return cr;
                            }
                        }
                    });

                    modalInstance.result.then(function (selectedItem) {
                        vm.modalSelected = selectedItem;
                    }, function () {
                        console.log("Modal dismissed at:  " + new Date());
                    });
                }

                function _deleteCr(cr) {
                    vm.crId = cr.id;
                    vm.$crAdminService.delete(vm.crId, vm.deleteSuccess, vm.onError);
                }

                function _resetSpamCr(cr) {
                    vm.crId = cr.id;
                    vm.$crAdminService.resetSpam(vm.crId, vm.resetSpamSuccess, vm.onError);
                }

                function _deleteSuccess(id) {
                    console.log("Deletion of Contact Request form was a success.");
                    render();
                }

                function _resetSpamSuccess(id) {
                    console.log("Contact Request sent to inbox.");
                    render();
                }

                function _recieveCr(data) {
                    vm.notify(function () {
                        vm.items = data.items;
                    });
                }

                function _selectCr(contact) {
                    console.log(contact);
                    vm.selectedCr = contact;
                }

                function _onError(jqXhr, error) {
                    console.error(error);
                }
            }
        })();

        (function () {
            "use strict";

            angular.module(APPNAME)
                .controller('modalController', ModalController);

            ModalController.$inject = ['$scope', '$baseController', '$uibModalInstance', 'contactrequest'];

            function ModalController($scope, $baseController, $uibModalInstance, contactrequest) {
                var vm = this;

                $baseController.merge(vm, $baseController);
                vm.$scope = $scope;
                vm.$uibModalInstance = $uibModalInstance;
                vm.contactrequest = contactrequest;

                vm.ok = function () {
                    vm.$uibModalInstance.close();
                };

                vm.cancel = function () {
                    vm.$uibModalInstance.dismiss('cancel');
                }
            };

        })();

    </script>
