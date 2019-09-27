/****************************************
 * Gateway for all the api calls
 * implements get, post, put, delete calls
 ****************************************/
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.InitialiseHttpUtils = InitialiseHttpUtils;
exports.Get = Get;
exports.Post = Post;
exports.Put = Put;
exports.Delete = Delete;

var _customError = require('./customError');

var _customError2 = _interopRequireDefault(_customError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const defaultHeaders = {
//     'Content-Type': 'application/json;charset=UTF-8',
// };

var apiList = {};

// default configuration, 
// each and every configuration can be modified with InitialiseHttpUtils method at global level as well as at individual level during api calls
var DefaultParams = {

    // urlPrefix is the url prefix, which will be appended with every request
    // urlPrefix must be specified with InitialiseHttpUtils method
    // also for individual calls, urlPrefix can be overridden
    urlPrefix: '',

    // with each api call, headers are sent 
    // this can be overridden at global level or inidi
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    },

    // resolve and rejects are callback functions which gets executed on success or failure of call respectively
    resolve: defaultResolve,
    reject: defaultReject,

    // cancels duplicate api call for the combination of same url and parameter and api method
    // bydefault this property is on
    allowDuplicateCall: false,

    credentials: 'include'

    /**
     * overrides configuration
     * @param  {object} params - accpets 
     * urlPrefix {string} (mandatory), 
     * headers {function} (optinal) , 
     * resolve {function} (optional),
     * reject {function} (optional),
     * allowDuplicateCall {boolean} (optional) default false
     */
};function InitialiseHttpUtils(params) {
    DefaultParams = _extends({}, DefaultParams, params);
}

/**
 * Get call implementation
 * @param  {object} attr - contains 
 * url{string} mandatory,
 * params(optional){proccessed and attached to url}, 
 * headers(optional), 
 * allowDuplicateCall(optional) - prevent from cancelling duplicate calls,
 * 
 */
function Get(attr) {
    if (!(attr && attr.url)) {
        return false;
    }
    var params = getNecessaryParams(attr);

    return ApiCall(params);
}

/**
 * Post call implementation
 * @param  {object} attr - contains url, params(optional){proccessed and attached to url}, 
 * headers(optional), body(optional)
 */
function Post(attr) {
    if (!(attr && attr.url)) {
        return false;
    }

    attr.method = 'POST';
    var params = getNecessaryParams(attr);
    return ApiCall(params);
}

/**
 * Put call implementation
 * @param  {object} attr - contains url, params(optional){proccessed and attached to url}, 
 * headers(optional), body(optional)
 */
function Put(attr) {
    if (!(attr && attr.url)) {
        return false;
    }

    attr.method = 'PUT';
    var params = getNecessaryParams(attr);
    return ApiCall(params);
}

/**
* Delete call implementation
* @param  {object} attr - contains url, params(optional){proccessed and attached to url}, 
* headers(optional)
*/
function Delete(attr) {
    if (!(attr && attr.url)) {
        return false;
    }

    attr.method = 'DELETE';
    var params = getNecessaryParams(attr);
    return ApiCall(params);
}

/**
 * once all params are derived, ApiCall is triggered to make fetch call
 * @param  {string} {url
 * @param  {function} method
 * @param  {object} headers
 * @param  {function} resolve
 * @param  {function} reject}
 */
function ApiCall(_ref) {
    var url = _ref.url,
        method = _ref.method,
        headers = _ref.headers,
        body = _ref.body,
        resolve = _ref.resolve,
        reject = _ref.reject,
        params = _ref.params,
        signal = _ref.signal,
        credentials = _ref.credentials;

    var postDict = {
        headers: headers, method: method
    };

    if (body) {
        // if body is attached
        postDict.body = body;
    }
    var status = '';

    /** Get the fuck out of the api */
    return fetch(url, {
        headers: headers,
        body: body,
        method: method,
        params: params,
        signal: signal,
        credentials: credentials
    }).then(function (response) {
        status = response.status;return response.json();
    }).then(function (response) {
        markCompletedCall(url);
        return resolve(response, status);
    }).catch(function (error) {
        markCompletedCall(url);
        console.log('error while hitting url => ', url);
        if (error && error.code == 20) {
            // if request is aborted 
            return { success: false, type: 'cancelled', status: status };
        }
        // return reject(error);
        throw new _customError2.default(reject(error), status);
    });
}

/**
 * prepares params for making api calls
 * including headers, url, params, resolve, reject
 * @param  {object} attr
 */
function getNecessaryParams(attr) {

    var url = createFinalUrl(attr);

    var method = attr.method || 'GET';

    var headers = createHeader(attr);

    var resolve = attr.hasOwnProperty('resolve') ? attr.resolve : DefaultParams.resolve;

    var reject = attr.hasOwnProperty('reject') ? attr.reject : DefaultParams.reject;

    var credentials = attr.hasOwnProperty('credentials') ? attr.credentials : DefaultParams.credentials;

    var signal = void 0;

    if (attr.allowDuplicateCall) {
        // do nothing     
    } else if (!DefaultParams.allowDuplicateCall) {
        signal = attr.signal || preventPreviousCall(url);
    }

    var response = {
        url: url,
        method: method,
        headers: headers,
        resolve: resolve,
        reject: reject,
        extraParams: attr.extraParams,
        signal: signal,
        credentials: credentials
    };

    if (attr.body) {
        if (attr.payloadType != 'FormData') {
            response.body = JSON.stringify(attr.body);
        } else {
            response.body = attr.body;
        }
    }

    return response;
}

/**
 * takes params along with end point, adds with prefix url and return final url
 * @param  {object} attr
 */
function createFinalUrl(attr) {
    return (attr.urlPrefix || DefaultParams.urlPrefix) + attr.url;
}

/**
 * takes extra headers(optional) and extend with default header
 * @param  {object} attr
 */
function createHeader(attr) {
    var headers = DefaultParams.headers;

    if (attr.resetHeader) {
        return attr.headers || {};
    }
    // if headers are not passed
    if (!attr.headers) {
        return headers;
    }

    return _extends({}, headers, attr.headers);
}

/**
 * default method to pass through on each success api call
 * @param  {object} response
 */
function defaultResolve(response, status) {
    return { data: response, status: status };
}

/**
 * default method to pass through on each failure api call
 * @param  {object} response
 */
function defaultReject(response) {
    return response;
}

/**
 * Detects if previously same api call is already in request
 * if so, abort the previous one and makes fresh call
 * @param  {string} url
 */
function preventPreviousCall(url) {
    var apiCall = apiList[url];
    if (window && window.AbortController) {
        var controller = new window.AbortController();
        if (apiCall) {
            try {
                apiCall.controller.abort();
            } catch (e) {}
        }
        apiList[url] = { url: url, controller: controller };
        return controller.signal;
    }
}

function markCompletedCall(url) {
    delete apiList[url];
}