import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiError from "../../error/app-error";
import { CreateUserBody, createUserSchema } from "./users.schemas";
import { UserRepository } from "./users.repositories";
import { emailQueue } from "../../queues/email.queue";

export class UserServices {

    static async create(body: CreateUserBody) {
        try {

            const data = createUserSchema.parse(body);
            const user = await UserRepository.getUserByEmail(data.email);

            if (user) throw new ApiError("Usuário já cadastrado com esse email.", 409);

            const hashPassword = await bcrypt.hash(data.password, 12);

            const parsedData = {
                NAME: data.name,
                EMAIL: data.email,
                PASSWORD_HASH: hashPassword
            };

            const createdUser = await UserRepository.createUser(parsedData);

            const job = await emailQueue.add("confirm-email",
                {
                    email: parsedData.EMAIL,
                    name: parsedData.NAME,
                    userId: createdUser.ID
                },
                {
                    attempts: 5,
                    backoff: {
                        type: "exponential", delay: 5000
                    }
                });

            console.log("job id: ", job.id);

        } catch (err) {
            throw err;
        };
    };
}