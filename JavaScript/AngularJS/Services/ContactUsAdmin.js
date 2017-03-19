
        //service for retrieving Contact Us AJAX calls that are stored as a jQuery format
        (function () {
            "use strict";

            angular.module(APPNAME)
                .factory("$crAdminService", $crAdminService);

            $crAdminService.$inject = ['$baseService', '$bringpro'];

            function $crAdminService($baseService, $bringpro) {
                var ajaxList = bringpro.services.contactrequest;
                var newService = $baseService.merge(true, {}, ajaxList, $baseService);
                return newService;
            }

        })();
