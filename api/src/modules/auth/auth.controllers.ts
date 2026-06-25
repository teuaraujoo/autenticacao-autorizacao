import AuthService from "./auth.services";
import cookieParser from "cookie-parser";
import { Request, Response } from "express";

export default class AuthController {

    static async create(req: Request, res: Response) {
        try {

            const body = await req.body;

            const result = await AuthService.create(body);

            res.status(200).json({
                message: "Uusário criado com sucesso",
                user: result
            });

        } catch (err) {
            return res.status(401).json(err);
        };
    };

    static async login(req: Request, res: Response) {
        try {

            const body = await req.body;

            const result = await AuthService.login(body);

            res.cookie('', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 1000 * 60 * 100,
                path: "/"
            });

            return res.status(200).json({
                message: `Login realizado com sucesso. Bem vindo ${result.user.name}`,
            });


        } catch (err) {
            return res.status(401).json(err);
        };
    };

    static async logout() {

    }
};
