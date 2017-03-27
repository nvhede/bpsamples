//controller for the accordions/summaries. Daniel is the best #1 - Daniel, in a pinch
(function () {
    "use strict";

    angular.module(APPNAME)
    .controller("userProfileJobsController", userProfileJobsController)
    .filter('phoneNumber', filter)
    .filter('utcToLocal', Filter);

    userProfileJobsController.$inject = ['$scope', '$baseController', '$dashboardService', '$jobsService', 'toastr', '$uibModal', '$routeParams'];

    function userProfileJobsController(
         $scope
        , $baseController
        , $dashboardService
        , $jobsService
        , toastr
        , $uibModal
        , $routeParams) {


        //init variables
        var vm = this;
        vm.jobs = null;
        vm.jobinfo = null;
        vm.jobStatusTab = null;
        vm.paginatedPayload = null;
        vm.colinfo = null;
        vm.colsize = "col-md-";
        vm.mapcood = {
            location: null,
            width: "800",
            height: "256",
            mapType: "roadmap",
            key: $('#staticMapKey').val(),
            markerSize: "mid",
            markerColor: "red",
            format: "png"
        };
        vm.map = null;
        vm.jobStatusJSON = JSON.parse($("#jobStatus").html());
        vm.jobTypeJSON = JSON.parse($("#jobType").html());
        vm.jobStatus = convertEnumToArray(vm.jobStatusJSON);
        vm.jobType = convertEnumToArray(vm.jobTypeJSON);
        vm.pagination = {
            "itemsPerPage": 10,
            "currentPage": 1,
            "totalItems": 0
        };
        vm.status = {
            oneAtATime: true,
            isCustomHeaderOpen: false,
            isFirstOpen: true,
            isFirstDisable: false
        };


        //hoisting
        vm.retrieveJobs = _retrieveJobs;
        vm.retrieveJobInfo = _retrieveJobInfo;
        vm.goToInvoice = _goToInvoice;
        vm.goToDraft = _goToDraft;

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

        //STARTUP
        function render() {
            console.log("Startup!");
            vm.retrieveJobs();
        }

        function _retrieveJobs() {
            vm.jobStatusTab = vm.$routeParams.jobStatus;
            //var enumint = null;
            //if route name does not exist/is default, get all jobs.
            if (vm.jobStatusTab == "All") {
                vm.paginatedPayload = {
                    "queryStatus": null
                };
                vm.$dashboardService.getJobsByTypeAndUserId(vm.paginatedPayload, _jobRetrievalSuccess, _jobError);
            }
            else if (!vm.jobStatusTab || vm.jobStatusTab == "Drafts") {
                vm.paginatedPayload = {
                    "queryStatus": 0
                };
                vm.$dashboardService.getJobsByTypeAndUserId(vm.paginatedPayload, _jobRetrievalSuccess, _jobError);
            }
            else if (vm.jobStatusTab == "Open") {
                vm.paginatedPayload = {
                    "queryStatus": 1
                };
                vm.$dashboardService.getJobsByTypeAndUserId(vm.paginatedPayload, _jobRetrievalSuccess, _jobError);
            }
            else if (vm.jobStatusTab == "Closed") {
                vm.paginatedPayload = {
                    "queryStatus": 10
                };
                vm.$dashboardService.getJobsByTypeAndUserId(vm.paginatedPayload, _jobRetrievalSuccess, _jobError);
            }
            else if (vm.jobStatusTab == "Cancelled") {
                vm.paginatedPayload = {
                    "queryStatus": 7
                };
                vm.$dashboardService.getJobsByTypeAndUserId(vm.paginatedPayload, _jobRetrievalSuccess, _jobError);
            }
        }

        function _retrieveJobInfo(id) {
            console.log("Retrieving info of ", id);
            vm.$jobsService.getById(id, _jobInfoRetrievalSuccess, _jobError);
        }

        function _jobInfoRetrievalSuccess(data) {
            console.log("Retrieval of info was a success!");
            vm.notify(function () {
                vm.jobinfo = data.item;
            });
            console.log(vm.jobinfo);
            _mapApi();
            _tableSplit();
        }

        function _jobRetrievalSuccess(data) {
            console.log("Retrieval was a success!");
            vm.notify(function () {
                vm.jobs = data.items;
            });
            console.log(vm.jobs);
            //changes int value of jobType enum to its name value for display on header
            for (var i = 0; i < vm.jobs.length; i++) {
                vm.jobs[i].typeName = null;
                for (var n = 0; n < vm.jobType.length; n++) {
                    if (vm.jobs[i].jobType.toString() == vm.jobType[n].id)
                        vm.jobs[i].typeName = vm.jobType[n].name;
                }
            };
        }

        function _jobError(error) {
            console.log(error);
        }

        //route redirect
        function _goToInvoice() {
            location.href = '/bringpro/dashboard/#/jobs/'+ vm.jobinfo.id +'/invoice';
        }

        function _goToDraft() {
            location.href = '/bringpro/job#/' + vm.jobinfo.id;
        }

        //dynamically splitting item list so it doesn't extend forever as one column.
        function _tableSplit() {
            vm.colsize = "col-md-";
            var fakeitemarray = []; //for all items
            var itemarray = []; //after taking out repeats
            var y = 3; //for # of items per col
            var n = 0; //for index of col in dictionary.
            vm.colinfo = [];
            var jobWaypoints = vm.jobinfo.jobWaypoints;

            $.each(jobWaypoints, function (index, value) {
                $.each(value.jobWaypointItemsPickup, function (index, value2) {
                    fakeitemarray.push(value2.jobItem.name);
                });
            });

            //if repeated words in our array, take em out!
            $.each(fakeitemarray, function (index, value) {
                if ($.inArray(value, itemarray) === -1)
                    itemarray.push(value);
            });

            //setting our # of columns
            var x = Math.round((itemarray.length) / (y)); //for # of columns we need
            var colwidth = Math.round(12 / x);
            vm.colsize += (colwidth.toString());

            //assigning col#, set items, and itemnumber values to vm.colinfo
            for (n; n < x; n++) {
                var itemdict = { colnumber: null, itemnumber: y, items: null };
                var itemdictarray = [];
                itemdict.colnumber = n;
                for (var i = 0; i < y; i++) {
                    if (!itemarray[i])
                        break;
                    else {
                        itemdictarray.push(itemarray[i]);
                    }
                }

                var splice = itemarray.splice(0,y);
                itemdict.items = itemdictarray;
                vm.colinfo.push(itemdict);
            }
        }

        //for google maps rendering w/markers.
        function _mapApi() {
            var wayptdict = [];
            var markercolors = [
                "black",
                "brown",
                "green",
                "purple",
                "yellow",
                "blue",
                "gray",
                "orange",
                "red",
                "white"
            ];
            $.each(vm.jobinfo.jobWaypoints, function (index, value) {
                var addr = (value.address.line1 + " " + value.address.city + " " + value.address.state);
                var location = addr.split(' ').join('+');
                var waypt = { address: location, color: null };
                wayptdict.push(waypt);
            });

            // setting each waypt's marker to a color and looping through
            //for (var i = 0; i < wayptdict.length; i++) {
            //    wayptdict[i].color = markercolors[i];
            //    var x = markercolors.length;
            //    if (!markercolors[i]) {
            //        var n = i % x;
            //        wayptdict[i].color = markercolors[n];
            //    }
            //}

            //if we want to set waypt marker color to certain ones
            for (var i = 0; i < wayptdict.length; i++) {
                if (i == 0) {
                    wayptdict[i].color = "blue";
                }
                else if (i == wayptdict.length - 1) {
                    wayptdict[i].color = "red";
                }
                else {
                    wayptdict[i].color = "green";
                }
            }
            //setting center of map to first waypoint
            vm.mapcood.location = wayptdict[0].address;

            vm.map = "http://maps.googleapis.com/maps/api/staticmap?center=" + vm.mapcood.location + "&size=" + vm.mapcood.width + "x" + vm.mapcood.height;
            $.each(wayptdict, function (index, value) {
                var marker = '\&markers=%7Ccolor:' + value.color + '%7C' + value.address;
                vm.map += marker;
            });
            var key = "&mobile=true&sensor=false&key=" + vm.mapcood.key;
            vm.map += key;
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

        //pagination function?

    }
})();
