import { UserServices } from "./users.services"
import { Request, Response } from "express";

export class UserController {
    static async create(req: Request, res: Response) {
        try {

            const body = await req.body;

            const result = await UserServices.create(body);

            res.status(200).json({
                message: "Usuário criado com sucesso",
                user: result
            });

        } catch (err) {
            return res.status(401).json(err);
        };
    };
};