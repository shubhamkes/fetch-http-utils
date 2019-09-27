# FETCH HTTP UTILS #
 
Target - Front End Projects

# What is it #

A tiny wrapper(1.2k) built around fetch to shorten your syntax and handle many things for you.

# What does it do #

It makes http call with very minimal syntax.

# Why should I use this library #

fetch-http-utils gives many functionalities at generic level (like cancelling duplicate calls) which can be configured at global level as well as can be overridden for individual api calls


### How do I get set up? ###

* Run 'fetch-http-utils --save'
* [fetch-http-utils](https://github.com/shubhamkes/fetch-http-utils) is very simple and intuitive to start with

### Initialisation

* To be invoked on app startup. 
```javascript
    import { InitialiseHttpUtils } from 'fetch-http-utils';

    // configure lib with this method
    // each of these configurations can be overridden at the time of individual api call
    InitialiseHttpUtils({
        // urlPrefix is the endpoint, which will be appended with every request, hence you just have to provide route while making api call each time
        // for eg https://www.someurl.com/getUsers , urlPrefix would be https://www.someurl.com/

        // urlPrefix must be specified with InitialiseHttpUtils method
        // also for individual calls, urlPrefix can be overridden
        urlPrefix: '',

        // with each api call, headers are sent 
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },

        // resolve and rejects are callback functions which gets executed on success or failure of call respectively
        resolve: defaultResolve,
        reject: defaultReject,

        // cancels duplicate api call for the combination of same url and parameter and api method
        // if set to true, will not cancel duplicate call
        allowDuplicateCall: false,

        credentials: 'include' 
    })

```

### APIs ###

* Get, Put, Post, Delete

```javascript
    const result = await Get({ url: 'getUsers' }); // considering urlPrefix https://www.someurl.com/
    console.log(result); // { data, status } 

    const result = await Post({ url: 'user', body: { name: 'test', email: 'test@test.com' } }); // 

    const result = await Put({ url: 'user', body: { name: 'test test' } }); /

    const result = await Delete({ url: 'users/1' }); 
```

### Params ###

```javascript
    /**
    * @param  {string} url - for eg https://www.someurl.com/getUsers, url should be 'getUsers' (considering urlPrefix is already initialsed using InitialiseHttpUtils)

    * @param  {object} headers (optional) - for individual call, headers can be extended with default ones

    * @param  {boolean} resetHeader (optional) - if set to true, will override the headers with one provided as param for that particular api call

    * @param  {any} body (optional) - payload to be sent (not applicable for Get and Delete call)

    * @param  {function} resolve (optional) - function which get invoked after successful completion of api call

    * @param  {function} reject (optional) - function which get invoked on failure of api call
    
    * @param  {object} credentials (optional) - default include
    */
```

### Some usecases ###

* How do I override endpoint for particular call  

```javascript
    await Get({ urlPrefix: 'https://www.someOtherurl.com/', url: 'getUsers' });
```

* How do I upload files 

```javascript
    const photo = { // all keys are taken for demo purpose, override them as per your requirement
        uri: file,
        type: 'image/jpeg',
        name: file.fileName,
    };

    const payload = new FormData();
    payload.append('file', photo);
    payload.append('name', 'imageName');

    // payloadType in this case would be resetHeader
    // headers are optional, but to be on safer side have added it headers
    const result = await Post({ url: 'someUploadUrl', body: payload, payloadType: 'FormData', resetHeader: true, headers: { 'Content-Type': 'multipart/form-data' } });
```

* How do I prevent from cancelling duplicate calls for few hits

```javascript
    await Get({ url: 'getUsers', allowDuplicateCall: true });
```
