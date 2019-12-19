/****************************************
 * Gateway for all the api calls
 * implements get, post, put, delete calls
 ****************************************/
'use strict';
// import CustomError from './customError';
const CustomError = require('./customError');

// const defaultHeaders = {
//     'Content-Type': 'application/json;charset=UTF-8',
// };

let apiList = {};

// default configuration, 
// each and every configuration can be modified with InitialiseHttpUtils method at global level as well as at individual level during api calls
let DefaultParams = {

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

    fetch: typeof fetch == 'undefined' ? null : fetch,

    credentials: 'include'
}

/**
 * overrides configuration
 * @param  {object} params - accpets 
 * urlPrefix {string} (mandatory), 
 * headers {function} (optinal) , 
 * resolve {function} (optional),
 * reject {function} (optional),
 * allowDuplicateCall {boolean} (optional) default false
 */
export function InitialiseHttpUtils(params) {
    DefaultParams = { ...DefaultParams, ...params };
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
export function Get(attr) {
    if (!(attr && attr.url)) {
        return false;
    }
    const params = getNecessaryParams(attr);

    return ApiCall(params);
}

/**
 * Post call implementation
 * @param  {object} attr - contains url, params(optional){proccessed and attached to url}, 
 * headers(optional), body(optional)
 */
export function Post(attr) {
    if (!(attr && attr.url)) {
        return false;
    }

    attr.method = 'POST';
    const params = getNecessaryParams(attr);
    return ApiCall(params);
}

/**
 * Put call implementation
 * @param  {object} attr - contains url, params(optional){proccessed and attached to url}, 
 * headers(optional), body(optional)
 */
export function Put(attr) {
    if (!(attr && attr.url)) {
        return false;
    }

    attr.method = 'PUT';
    const params = getNecessaryParams(attr);
    return ApiCall(params);
}

/**
* Delete call implementation
* @param  {object} attr - contains url, params(optional){proccessed and attached to url}, 
* headers(optional)
*/
export function Delete(attr) {
    if (!(attr && attr.url)) {
        return false;
    }

    attr.method = 'DELETE';
    const params = getNecessaryParams(attr);
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
function ApiCall({ url, method, headers, body, resolve, reject, params, signal, credentials }) {
    const postDict = {
        headers, method
    };

    if (body) { // if body is attached
        postDict.body = body;
    }
    let status = '';

    let Fetch = DefaultParams.fetch;

    /** Get the fuck out of the api */
    return Fetch(url, {
        headers,
        body,
        method,
        params,
        signal,
        credentials
    })
        .then((response) => { status = response.status; return response.json() })
        .then((response) => {
            markCompletedCall(url);
            return resolve(response, status);
        })
        .catch((error) => {
            markCompletedCall(url);
            console.log('error while hitting url => ', url);
            if (error && error.code == 20) { // if request is aborted 
                return { success: false, type: 'cancelled', status };
            }
            // return reject(error);
            throw new CustomError(reject(error), status);
        });
}

/**
 * prepares params for making api calls
 * including headers, url, params, resolve, reject
 * @param  {object} attr
 */
function getNecessaryParams(attr) {

    const url = createFinalUrl(attr);

    const method = attr.method || 'GET';

    const headers = createHeader(attr);

    const resolve = attr.hasOwnProperty('resolve') ? attr.resolve : DefaultParams.resolve;

    const reject = attr.hasOwnProperty('reject') ? attr.reject : DefaultParams.reject;

    const credentials = attr.hasOwnProperty('credentials') ? attr.credentials : DefaultParams.credentials;

    let signal;

    if (attr.allowDuplicateCall) {
        // do nothing     
    } else if (!DefaultParams.allowDuplicateCall) {
        signal = attr.signal || preventPreviousCall(url);
    }

    const response = {
        url,
        method,
        headers,
        resolve,
        reject,
        extraParams: attr.extraParams,
        signal,
        credentials
    };

    if (attr.body) {
        if (attr.payloadType != 'FormData') {
            response.body = JSON.stringify(attr.body);
        } else {
            response.body = attr.body;
        }
    }

    return (response);
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
    const headers = DefaultParams.headers;

    if (attr.resetHeader) {
        return attr.headers || {};
    }
    // if headers are not passed
    if (!attr.headers) {
        return headers;
    }

    return { ...headers, ...attr.headers };
}

/**
 * default method to pass through on each success api call
 * @param  {object} response
 */
function defaultResolve(response, status) {
    return { data: response, status };
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
    const apiCall = apiList[url];
    if ((typeof window != 'undefined') && window.AbortController) {
        const controller = new window.AbortController();
        if (apiCall) {
            try {
                apiCall.controller.abort();
            } catch (e) { }
        }
        apiList[url] = { url, controller };
        return controller.signal;
    }
}

function markCompletedCall(url) {
    delete apiList[url];
}


function isUndefined(variable) {
    return typeof variable == 'undefined';
}