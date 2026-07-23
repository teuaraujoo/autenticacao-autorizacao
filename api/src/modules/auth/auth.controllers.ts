import AuthService from "./auth.services";
import { Request, Response } from "express";
import ApiError from "../../error/app-error";
import { TokenExpiredError } from "jsonwebtoken";
export default class AuthController {

    static async login(req: Request, res: Response) {
        const body = await req.body;

        const result = await AuthService.login(body);

        res.cookie("accessToken", result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 1000 * 60 * 15,
            path: "/"
        });

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
        })

        return res.status(200).json({
            message: `Login realizado com sucesso. Bem vindo ${result.user.name}`,
        });
    };

    static async logout(req: Request, res: Response) {

        const revokedToken = await AuthService.logout(req.refreshToken);

        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/"
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/"
        });

        return res.status(200).json({ message: "Logout  realizado com sucesso.", data: revokedToken });
    };

    static async refresh(req: Request, res: Response) {
        const result = await AuthService.refresh(req.refreshToken);

        res.cookie("accessToken", result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 1000 * 60 * 15,
            path: "/"
        });

        res.status(200).json({ message: "Token renovado com sucesso." });
    };

    static async me(req: Request, res: Response) {
        const result = await AuthService.me(req.user.email);

        return res.status(200).json({ message: "Informações encontradas com sucesso.", data: result });
    };

    static async confirmEmail(req: Request, res: Response) {
        const { userId } = req.params;

        await AuthService.confirmEmail(Number(userId));

        return res.status(200).json({ message: "Email confirmado com sucesso." });
    };
};
