import { NextFunction, Request, Response } from "express";
import ApiError from "../error/app-error";
import jwt from "jsonwebtoken";

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            message: err.message
        });
    }

    if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
            message: "Access Token expirado."
        });
    }

    if (err instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
            message: "Access Token inválido."
        });
    }

    console.error(err);

    return res.status(500).json({
        message: "Erro interno do servidor."
    });
};