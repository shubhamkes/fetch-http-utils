export interface RequestDto {
    baseURL?: string;

    headers?: {};
    data?: {};
    url: string;

    resetHeader?: boolean;
    timeout?: number;

    params?: {};

    allowDuplicateCall?: boolean;
}
