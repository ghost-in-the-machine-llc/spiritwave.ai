import { Status, STATUS_TEXT } from 'http/status';

export class HttpError extends Error {
    statusCode = Status.InternalServerError;
    statusText = STATUS_TEXT[Status.InternalServerError];

    constructor(statusCode: Status, message: string, statusText?: string) {
        super(message);
        this.statusCode = statusCode;
        this.statusText = statusText || STATUS_TEXT[statusCode];
    }
}

export class NoDataError extends Error {}
