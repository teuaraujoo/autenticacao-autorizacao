import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma"

export class UserRepository {

    static async getUserByEmail(email: string) {
        return prisma.uSERS.findUnique({ where: { EMAIL: email } });
    };

    static async createUser(user: Prisma.USERSCreateInput) {
        return prisma.uSERS.create({ data: user });
    };
};