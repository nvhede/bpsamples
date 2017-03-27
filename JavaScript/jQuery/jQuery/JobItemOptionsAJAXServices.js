bringpro.services.jobitemoptions = bringpro.services.jobitemoptions || {}

//LIST OF AJAX CALLS

//posts a Job Item
bringpro.services.jobitemoptions.post = function (data, onSuccess, onError) {
    var url = "/api/jobitemoptions";

    var settings = {
        cache: false,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        data: data,
        dataType: 'json',
        success: onSuccess,
        error: onError,
        type: 'POST'
    };

    $.ajax(url, settings);
}
//gets Job Item info by its ID
bringpro.services.jobitemoptions.getInfoById = function (id, onSuccess, onError) {
    var url = "/api/jobitemoptions/" + id;

    var settings = {
        cache: false,
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: id,
        dataType: 'json',
        success: onSuccess,
        error: onError,
        type: 'GET'
    };

    $.ajax(url, settings);
}

//gets all the current Job Items from db
bringpro.services.jobitemoptions.getAll = function (onAjaxSuccess, onAjaxError) {
    var url = "/api/jobitemoptions";
    var settings = {
        cache: false,
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        dataType: 'json',
        success: onAjaxSuccess,
        error: onAjaxError,
        type: 'GET'
    };

    $.ajax(url, settings);
}

//updates a Job Item by its ID
bringpro.services.jobitemoptions.update = function (id, data, onSuccess, onError) {
    var url = "/api/jobitemoptions/" + id;

    var settings = {
        cache: false,
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: data,
        dataType: 'json',
        success: onSuccess,
        error: onError,
        type: 'PUT'
    };

    $.ajax(url, settings);
}

//deletes a Job Item by its ID
bringpro.services.jobitemoptions.delete = function (id, onSuccess, onError) {
    var url = "/api/jobitemoptions/" + id;

    var settings = {
        cache: false,
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: id,
        dataType: 'json',
        success: onSuccess,
        error: onError,
        type: 'DELETE'
    };

    $.ajax(url, settings);
}
