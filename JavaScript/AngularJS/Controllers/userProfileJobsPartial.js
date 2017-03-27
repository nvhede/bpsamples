//PARTIAL: controls the tab
(function () {
    "use strict";

    angular.module(APPNAME)
        .controller("userProfileJobsPartialController", userProfileJobsPartialController);

    userProfileJobsPartialController.$inject = ['$scope', '$baseController', '$dashboardService', 'toastr', '$uibModal', '$routeParams'];

    function userProfileJobsPartialController(
          $scope
        , $baseController
        , $dashboardService
        , toastr
        , $uibModal
        , $routeParams) {

        //init variables: retrieiving our enum of jobType, creating our job tabs, and getting the route
        var vm = this;
        vm.jobTypeJSON = JSON.parse($("#jobStatus").html());
        vm.jobType = convertEnumToArray(vm.jobTypeJSON);
        vm.jobtabs = [
            { enumvalue: 0, label: "Drafts", icon: 'zmdi zmdi-truck' },
            { enumvalue: null, label: "All", icon: 'zmdi zmdi-truck' },
            { enumvalue: 1, label: "Open", icon: 'zmdi zmdi-check'},
            { enumvalue: 10, label: "Closed", icon: 'zmdi zmdi-close' },
            { enumvalue: 7, label: "Cancelled", icon: 'zmdi zmdi-block-alt' }
        ];
        vm.selectedTab = vm.jobtabs[0];
        vm.tabRoute = null;

        //hoisting
        vm.setSelectedTab = _setSelectedTab;
        vm.activeClass = _activeClass;

        //inheritance
        vm.$scope = $scope;
        vm.$baseController = $baseController;
        vm.$dashboardService = $dashboardService;
        vm.toastr = toastr;
        vm.$uibModal = $uibModal;
        vm.$routeParams = $routeParams;

        $baseController.merge(vm, $baseController);
        vm.notify = vm.$dashboardService.getNotifier($scope);


        //looping through tabs and our jobType.
        //associating our jobType # and name with our tab enumvalue and name.
        //passes enum value to our partial view depending on tab clicked.

        //for (var i = 0; i < vm.jobtabs.length; i++) {
        //    vm.jobtabs[i].enumvalue = Object.keys(vm.jobType)[i];
        //    vm.jobtabs[i].label = vm.jobType[Object.keys(vm.jobType)[i]];
        //};

        //$.each(vm.jobType,
        //    function (index, value) {
        //        var tab = { enumvalue: null, label: null, icon: null };
        //        tab.enumvalue = value.id;
        //        tab.label = value.name;

        //        switch (tab.enumvalue) {
        //            case 1:
        //                tab.icon = 'zmdi zmdi-assignment-account';
        //                break;
        //            case 2:
        //                tab.icon = 'zmdi zmdi-label-heart';
        //                break;
        //            case 3:
        //                tab.icon = '';
        //                break;
        //            case 4:
        //                tab.icon = '';
        //                break;
        //            case 6:
        //                tab.icon = '';
        //                break;
        //            case 7:
        //                tab.icon = '';
        //                break;
        //            case 8:
        //                tab.icon = '';
        //                break;
        //                //add more cases if you have more tabs/JobType enums and want icons.
        //            default:
        //                tab.icon = 'zmdi zmdi-truck';
        //                //this is default value. we do not have a JobType enum of 0, but if you were to
        //                // make one, then you would need to do a case 0, otherwise it will use this default.
        //        }

        //        vm.jobtabs.push(tab);
        //    });

        render();

        //STARTUP: rendering our tabs and setting clicked tab to have an :active class.
        function render() {
            console.log("Tabs are loading!");
            vm.tabRoute = vm.$routeParams.jobStatus;
            console.log("This is our route extension: ", vm.tabRoute);
            $.each(vm.jobtabs,
                function (index, value) {
                    if (vm.tabRoute == value.label) {
                        _setSelectedTab(value);
                    }
                });
        }
        //sets the 'active' class to the tab clicked on.
        function _activeClass(tab) {
            if (vm.selectedTab == tab) {
                return "active";
            } else {
                return "";
            }
        }

        function _setSelectedTab(tab) {
            vm.selectedTab = tab;
        }

        //converting enum to an array
        function convertEnumToArray(EnumJson) {
            var array = [];
            $.each(EnumJson,
                function (index, value) {
                    var enumObj = {};
                    enumObj.id = index;
                    enumObj.name = value;
                    array.push(enumObj);
                });
            return array;
        }
    }
})();
