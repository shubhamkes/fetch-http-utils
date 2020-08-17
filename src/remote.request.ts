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
        this.axiosInstance = Axios.create({ ...defaultConfig, ...options });

        this.init(options);
    }

    static getInstance(options: RequestInitDto) {
        if (this.instance) return this.instance;

        this.instance = new RemoteRequest(options);

        return this.instance;
    }

    private init(options: RequestInitDto) {
        // Object.assign(this.attributes, options);
        this.attributes = { ...this.attributes, ...options };
    }

    private attachBaseHeaders() {
        return {
            Authorization: '1',
            'Content-Type': 'application/json',
        };
    }

    async get(options: RequestDto) {
        let attributes: axios.AxiosRequestConfig = { ...options, method: 'get' };
        attributes = this.sanitizeOptions(attributes);

        return this.process(attributes);
    }

    async post(options: RequestDto) {
        let attributes: axios.AxiosRequestConfig = { ...options, method: 'post' };
        attributes = this.sanitizeOptions(attributes);

        return this.process(attributes);
    }

    async put(options: RequestDto) {
        let attributes: axios.AxiosRequestConfig = { ...options, method: 'put' };
        attributes = this.sanitizeOptions(attributes);

        return this.process(attributes);
    }

    async delete(options: RequestDto) {
        let attributes: axios.AxiosRequestConfig = { ...options, method: 'delete' };
        attributes = this.sanitizeOptions(attributes);

        return this.process(attributes);
    }

    sanitizeOptions(options) {
        const attr = this.attributes.headers;
        if (options.resetHeader) { // incase of resetHeader true, default headers is ignored
            attr.headers = {};
        }
        // const headers = this.
        return Object.assign(attr, options);
    }

    async process(options: axios.AxiosRequestConfig) {
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
