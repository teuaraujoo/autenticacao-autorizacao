import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../../error/app-error";
import { CreateUserBody, createUserSchema } from "./users.schemas";
import { UserRepository } from "./users.repositories";

export class UserServices {

    static async create(body: CreateUserBody) {
        try {

            const data = createUserSchema.parse(body);
            const user = await UserRepository.getUserByEmail(data.EMAIL);

            if (user) throw new AppError("Usuário já cadastrado com esse email.", 409);

            const hashPassword = await bcrypt.hash(data.PASSWORD, 12);

            const parsedData = {
                NAME: data.NAME,
                EMAIL: data.EMAIL,
                PASSWORD_HASH: hashPassword
            };

            return await UserRepository.createUser(parsedData);

        } catch (err) {
            throw err;
        };
    };
}