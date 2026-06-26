export default class ApiError extends Error {
    statusCode: number;

    constructor(messasge: string, statusCode = 400) {
        super(messasge);
        this.statusCode = statusCode;
    };
};