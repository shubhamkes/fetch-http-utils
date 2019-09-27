
export default class CustomError extends Error {
    constructor(error = '', status) {
        super(...status);

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomError);
        }

        this.error = error;
        this.status = status;

    }
}
