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
    import { Http } from 'fetch-http-utils';

    // configure lib with this method
    // each of these configurations can be overridden at the time of individual api call
    const http = Http.getInstance({
        baseURL: 'https://sk-api-services.herokuapp.com/', 
        headers: {
           'Content-Type': 'application/json;charset=UTF-8'
        },
        timeout: 0, // default is 0
    });
```

### APIs ###

* get, put, post, delete

```javascript
    const result = await http.get({ url: 'getUsers' }); // considering baseURL https://www.someurl.com/
    console.log(result); // { data, status } 

    const result = await http.post({ url: 'user', data: { name: 'test', email: 'test@test.com' } }); // 

    const result = await http.put({ url: 'user', data: { name: 'test test' } }); /

    const result = await http.delete({ url: 'users/1' }); 
```

### Params ###

```javascript
    /**
    * @param  {string} url - for eg https://www.someurl.com/getUsers, url should be 'getUsers' (considering baseURL is already initialsed using InitialiseHttpUtils)

    * @param  {object} headers (optional) - for individual call, headers can be extended with default ones

    * @param  {boolean} resetHeader (optional) - if set to true, will override the headers with one provided as param for that particular api call

    * @param  {any} data (optional) - payload to be sent (not applicable for Get and Delete call)
    
    * @param  {object} credentials (optional) - default false
    */
```

### Some usecases ###

* How do I override endpoint for particular call  

```javascript
    await http.get({ baseURL: 'https://www.someOtherurl.com/', url: 'getUsers' });
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
    const result = await http.post({ url: 'someUploadUrl', data: payload, resetHeader: true, headers: { 'Content-Type': 'multipart/form-data' } });
```

* How do I prevent from cancelling duplicate calls for few hits

```javascript
    await http.get({ url: 'getUsers', allowDuplicateCall: true });
```
