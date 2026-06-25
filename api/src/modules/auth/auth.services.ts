import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CreateUserBody, createUserSchema, LoginBody, loginUserSchema } from "./auth.schemas";
import { AuthRepository } from "./auth.repositories";
import { AppError } from "../../error/app-error";

export default class AuthService {

    static async create(body: CreateUserBody) {

        try {

            const data = createUserSchema.parse(body);
            const hashPassword = await bcrypt.hash(data.PASSWORD, 12);

            const parsedData = {
                NAME: data.NAME,
                EMAIL: data.EMAIL,
                PASSWORD_HASH: hashPassword
            };

            return await AuthRepository.createUser(parsedData);

        } catch (err) {
            throw err;
        };
    };

    static async login(body: LoginBody) {
        try {

            const data = loginUserSchema.parse(body);
            const user = await AuthRepository.getUserByEmail(data.email);

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