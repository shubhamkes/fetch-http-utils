import Axios, * as axios from 'axios';

import { RequestDto } from './dtos/request.dto';
export class RemoteRequest {
    private static instance: RemoteRequest;

    private attributes: axios.AxiosRequestConfig = {};

    private constructor(options: RequestInit) {
        this.init(options);
    }

    static getInstance(options: RequestInit) {
        if (this.instance) return this.instance;

        this.instance = new RemoteRequest(options);
        return this.instance;
    }

    private init(options: RequestInit) {
        Object.assign(this.attributes, options);
    }

    private attachBaseHeaders() {
        return {
            Authorization: '1',
            'Content-Type': 'application/json',
        };
    }
    async get(options: RequestDto) {
        const attributes: axios.AxiosRequestConfig = {};
        Object.assign(attributes, options);

        attributes.method = 'get';

        this.process(attributes);
    }

    async process(options: axios.AxiosRequestConfig) {
        Axios(options)
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}
