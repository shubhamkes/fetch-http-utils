import Axios, * as axios from 'axios';

import { RequestDto, RequestInitDto } from './dtos';

const defaultConfig = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    }
}

export class RemoteRequest {
    private static instance: RemoteRequest;
    private axiosInstance: axios.AxiosInstance;

    private attributes: axios.AxiosRequestConfig = {};

    private constructor(options: RequestInitDto) {
        // create an instance of axios with the congig options
        this.axiosInstance = Axios.create({ ...defaultConfig, ...options });

        this.init(options);
    }

    /**
     * create singleton instance of class
     * @param  {RequestInitDto} options
     */
    static getInstance(options: RequestInitDto) {
        if (this.instance) return this.instance;

        this.instance = new RemoteRequest(options);

        return this.instance;
    }

    private init(options: RequestInitDto) {
        // update internal config attibutes
        this.attributes = { ...this.attributes, ...options };
    }


    /**
     * implements get method 
     * @param  {RequestDto} options
     */
    async get(options: RequestDto) {
        let attributes: axios.AxiosRequestConfig = { ...options, method: 'get' };
        attributes = this.sanitizeOptions(attributes);

        return this.process(attributes);
    }

    /**
     * implements post method 
     * @param  {RequestDto} options
     */
    async post(options: RequestDto) {
        let attributes: axios.AxiosRequestConfig = { ...options, method: 'post' };
        attributes = this.sanitizeOptions(attributes);

        return this.process(attributes);
    }

    /**
     * implements put method 
     * @param  {RequestDto} options
     */
    async put(options: RequestDto) {
        let attributes: axios.AxiosRequestConfig = { ...options, method: 'put' };
        attributes = this.sanitizeOptions(attributes);

        return this.process(attributes);
    }

    /**
     * implements delete method 
     * @param  {RequestDto} options
     */
    async delete(options: RequestDto) {
        let attributes: axios.AxiosRequestConfig = { ...options, method: 'delete' };
        attributes = this.sanitizeOptions(attributes);

        return this.process(attributes);
    }

    /**
     * sanitizes parameter and syncs with default config attributes
     * also create header object  
     * @param  {RequestDto} options
     */
    private sanitizeOptions(options) {
        const attr = this.attributes.headers;
        if (options.resetHeader) { // incase of resetHeader true, default headers is ignored
            attr.headers = {};
        }
        // const headers = this.
        return Object.assign(attr, options);
    }

    /**
     * api call using axios instance
     * @param  {axios.AxiosRequestConfig} options
     */
    private async process(options: axios.AxiosRequestConfig) {
        // options.url = options.baseURL + options.url;
        return this.axiosInstance(options)
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                return error;
            });
    }
}
