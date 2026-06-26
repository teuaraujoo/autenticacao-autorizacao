import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma"

export class UserRepository {

    static async getUserByEmail(email: string) {
        return prisma.uSERS.findUnique({ where: { EMAIL: email } });
    };

    static async getById(id: number) {
        return prisma.uSERS.findUnique({ where: { ID: id } });
    };

    static async createUser(user: Prisma.USERSCreateInput) {
        return prisma.uSERS.create({ data: user });
    };
};