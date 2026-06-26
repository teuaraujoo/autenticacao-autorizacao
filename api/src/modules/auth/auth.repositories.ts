import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

export class AuthRepository {
    static async saveRefreshToken(refreshToken: Prisma.REFRESH_TOKENSCreateInput) {
        return await prisma.rEFRESH_TOKENS.create({ data: refreshToken });
    };

    static async findByHash(token: string) {
        return prisma.rEFRESH_TOKENS.findFirst({ where: { TOKEN_HASH: token } });
    };

    static async revokedToken(id: number) {
        const now = new Date();

        return prisma.rEFRESH_TOKENS.update({
            where: { ID: id },
            data: { REVOKED_AT: now }
        });
    };
};