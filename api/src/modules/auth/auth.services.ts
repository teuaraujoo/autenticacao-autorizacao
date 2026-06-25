import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LoginBody, loginUserSchema } from "./auth.schemas";
import { UserRepository } from "../users/users.repositories";
import { AppError } from "../../error/app-error";

export default class AuthService {

    static async login(body: LoginBody) {
        try {

            const data = loginUserSchema.parse(body);
            const user = await UserRepository.getUserByEmail(data.email);

            if (!user) throw new AppError("Senha ou email inválidos.", 401);

            const correctPassword = await bcrypt.compare(body.password, user.PASSWORD_HASH);

            if (!correctPassword) throw new AppError("Senha ou email incorretos!", 401);

            const token = jwt.sign({ id: user.ID }, process.env.JWT_SECRET!, { expiresIn: "15m" });

            return {
                token,
                user: {
                    name: user.NAME
                },
            };
        } catch (err) {
            throw err;
        };
    };
};