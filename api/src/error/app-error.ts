export class AppError extends Error {
    statusCode: number;

    constructor(messasge: string, statusCode = 400) {
        super(messasge);
        this.statusCode = statusCode;
    };
};