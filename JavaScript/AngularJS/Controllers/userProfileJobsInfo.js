//controller for the Invoice and job information.
(function () {
    "use strict";

    angular.module(APPNAME)
        .controller("userProfileInvoiceController", userProfileInvoiceController)
        .filter('utcToLocal', Filter);

    userProfileInvoiceController.$inject = ['$scope', '$baseController', '$dashboardService', '$jobsService', 'toastr', '$uibModal', '$routeParams'];

    function userProfileInvoiceController(
         $scope
        , $baseController
        , $dashboardService
        , $jobsService
        , toastr
        , $uibModal
        , $routeParams) {

        //init variables
        var vm = this;
        vm.jobinfo = null;
        vm.map = null;
        vm.jobId = null;
        vm.activityLog = null;
        vm.jobStatusJSON = JSON.parse($("#jobStatus").html());
        vm.jobTypeJSON = JSON.parse($("#jobType").html());
        vm.jobStatus = convertEnumToArray(vm.jobStatusJSON);
        vm.jobType = convertEnumToArray(vm.jobTypeJSON);
        //required parameters for google static maps api
        vm.mapcood = {
            location: null,
            zoom: 12,
            width: "440",
            height: "135",
            mapType: "roadmap",
            key: $('#staticMapKey').val(),
            markerSize: "mid",
            markerColor: "red",
            format: "png"
        };

        //hoisting

        //inheritance
        vm.$scope = $scope;
        vm.$baseController = $baseController;
        vm.$dashboardService = $dashboardService;
        vm.$jobsService = $jobsService;
        vm.toastr = toastr;
        vm.$uibModal = $uibModal;
        vm.$routeParams = $routeParams;

        $baseController.merge(vm, $baseController);
        vm.notify = vm.$dashboardService.getNotifier($scope);

        render();

        //STARTUP: retrieve the job info and the job activity info.
        function render() {
            vm.jobId = vm.$routeParams.jobId;
            console.log("This is the job id:", vm.jobId);
            vm.$jobsService.getById(vm.jobId, _jobRetrievalSuccess, _jobError);
            vm.$jobsService.getActivityByJobId(vm.jobId, _activitySuccess, _activityError);
        }

        //upon success, we also use the google static maps API and render the map
        //of the location as well as the total time required for the operation.
        function _jobRetrievalSuccess(data) {
            console.log("Job retrieval was a success!");
            vm.notify(function () {
                vm.jobinfo = data.item;
                _mapApi();
                _totalTime();
            });
            console.log(vm.jobinfo);

        }

        function _jobError(error) {
            console.log(error);
        }

        //retrieval of the job's activity ifnormation.
        function _activitySuccess(data) {
            console.log("Activity retrieval was a success!");
            vm.notify(function () {
                vm.activityLog = data.items;
                _activityParse(vm.activityLog);
            });
            console.log(vm.activityLog);
        }

        function _activityError(error) {
            console.log("Activity was not recieved!", error);
        }

        //google maps static API; this is an image src link so we have to hardcode some stuff.
        function _mapApi() {
            var waypoints = vm.jobinfo.jobWaypoints;
            for (var i = 0; i < waypoints.length; i++) {
                vm.jobinfo.jobWaypoints[i].googleurl = null;
                var addr = (waypoints[i].address.line1 + " " + waypoints[i].address.city + " " + waypoints[i].address.state);
                var location = addr.split(' ').join('+');
                var waypt = { address: location, color: null };
                if (i == 0) {
                    waypt.color = "blue";
                }
                else if (i == waypoints.length - 1) {
                    waypt.color = "red";
                }
                else {
                    waypt.color = "green";
                }
                vm.mapcood.location = waypt.address;
                vm.map = "http://maps.googleapis.com/maps/api/staticmap?center=" + vm.mapcood.location + "&zoom=" + vm.mapcood.zoom + "&size=" + vm.mapcood.width + "x" + vm.mapcood.height;
                var marker = '&markers=' + '%7Ccolor:' + waypt.color + '%7C' + waypt.address;
                vm.map += marker;
                var key = "&key=" + vm.mapcood.key;
                vm.map += key;
                vm.jobinfo.jobWaypoints[i].googleurl = vm.map;
            }
        }

        //logic for implementing the total time it took for the items to get there.
        function _totalTime() {
            var waypoints = vm.jobinfo.jobWaypoints;
            var maxTime = [];
            var minTime = [];
            $.each(waypoints,
                function (index, value) {
                    $.each(value.jobWaypointItemsPickup,
                        function (index2, value2) {
                            maxTime.push(value2.jobItem.maxTime);
                            minTime.push(value2.jobItem.minTime);
                        });
                    $.each(value.jobWaypointItemsDropOff,
                        function (index3, value3) {
                            maxTime.push(value3.jobItem.maxTime);
                            minTime.push(value3.jobItem.minTime);
                        });
                });
            vm.jobinfo.maxSum = maxTime.reduce(add, 0);
            vm.jobinfo.minSum = minTime.reduce(add, 0);
        }

        //parsing the activity information so we can have appropriate labels/icons for it.
        function _activityParse(data) {
            $.each(data, function (index, value) {
                value.jsonResponse = JSON.parse(value.rawResponse);
                value.activityTypeInfo = { message: null, icon: null, color: null, date: value.idCreated, statuschange: null };
                //switch (value.activityTypeId) {
                //    case 4:
                //        value.activityTypeInfo.message = "was created.";
                //        value.activityTypeInfo.icon = "zmdi zmdi-star";
                //        value.activityTypeInfo.color = "blue";
                //        break;
                //    case 5:
                //        value.activityTypeInfo.message = "was updated.";
                //        value.activityTypeInfo.icon = "zmdi zmdi-check-circle";
                //        value.activityTypeInfo.color = "green";
                //        break;
                //    case 6:
                //        value.activityTypeInfo.message = "was deleted.";
                //        value.activityTypeInfo.icon = "zmdi zmdi-minus-circle";
                //        value.activityTypeInfo.color = "red";
                //        break;
                //    //testing; only activityTypeId 10 works right now, and targetValue = JobStatus
                //    default:
                //        value.activityTypeInfo.message = "was changed.";
                //        value.activityTypeInfo.icon = "zmdi zmdi-check-circle";
                //        value.activityTypeInfo.color = "green";
                //        break;
                //}

                //checking if targetValue matches JobStatus and if so, assigns that id to statuschange.
                for (var i = 0; i < vm.jobStatus.length; i++) {
                    if (vm.jobStatus[i].id == value.targetValue.toString()) {
                        value.activityTypeInfo.statuschange = vm.jobStatus[i].id;
                        break;
                    }
                }

                switch (value.activityTypeInfo.statuschange) {
                    case "0":
                        value.activityTypeInfo.message = "You created a job.";
                        value.activityTypeInfo.icon = "zmdi zmdi-star";
                        value.activityTypeInfo.color = "blue";
                        break;
                    case "1":
                        value.activityTypeInfo.message = "The job has been assigned.";
                        value.activityTypeInfo.icon = "zmdi zmdi-check-circle";
                        value.activityTypeInfo.color = "green";
                        break;
                    case "2":
                        value.activityTypeInfo.message = "Your job is on the way!";
                        value.activityTypeInfo.icon = "zmdi zmdi-check-circle";
                        value.activityTypeInfo.color = "green";
                        break;
                    case "3":
                        value.activityTypeInfo.message = "Your job has been completed.";
                        value.activityTypeInfo.icon = "zmdi zmdi-check-circle";
                        value.activityTypeInfo.color = "green";
                        break;
                    case "4":
                        value.activityTypeInfo.message = "Your job is checked in!";
                        value.activityTypeInfo.icon = "zmdi zmdi-check-circle";
                        value.activityTypeInfo.color = "green";
                        break;
                    case "6":
                        value.activityTypeInfo.message = "Your job has been accepted.";
                        value.activityTypeInfo.icon = "zmdi zmdi-check-circle";
                        value.activityTypeInfo.color = "green";
                        break;
                    case "7":
                        value.activityTypeInfo.message = "Your job has been cancelled.";
                        value.activityTypeInfo.icon = "zmdi zmdi-minus-circle";
                        value.activityTypeInfo.color = "red";
                        break;
                    case "8":
                        value.activityTypeInfo.message = "Your job has been rejected.";
                        value.activityTypeInfo.icon = "zmdi zmdi-minus-circle";
                        value.activityTypeInfo.color = "red";
                        break;
                }

            });

        }

        //converting our enum to an array
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

        function add(a, b) {
            return a + b;
        }
    }


})();
