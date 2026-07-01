import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LoginBody, loginUserSchema } from "./auth.schemas";
import { UserRepository } from "../users/users.repositories";
import ApiError from "../../error/app-error";
import { AuthRepository } from "./auth.repositories";

export default class AuthService {

    private static FIFTEEN_MINUTES = 15;
    private static SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

    static async login(body: LoginBody) {
        try {

            const data = loginUserSchema.parse(body);
            const user = await UserRepository.getUserByEmail(data.email);

            if (!user) throw new ApiError("Senha ou email inválidos.", 401);

            const correctPassword = await bcrypt.compare(body.password, user.PASSWORD_HASH);

            if (!correctPassword) throw new ApiError("Senha ou email incorretos!", 401);

            const accessToken = jwt.sign({ sub: user.ID, email: user.EMAIL }, process.env.JWT_SECRET!, { expiresIn: `${this.FIFTEEN_MINUTES}m` });
            const { refreshToken, tokenHash } = this.generateTokenHash();

            const refreshTokenData = {
                TOKEN_HASH: tokenHash,
                EXPIRES_AT: this.generateExpiresAt(),
                USERS: {
                    connect: {
                        ID: user.ID,
                    },
                },
            };

            const persistRefreshToken = await AuthRepository.saveRefreshToken(refreshTokenData);

            if (!persistRefreshToken) throw new ApiError("Error ao armazenar token no banco.", 401);

            return {
                accessToken,
                refreshToken,
                user: {
                    name: user.NAME
                },
            };
        } catch (err) {
            throw err;
        };
    };

    static async logout(token: string) {
        try {
            const refreshToken = this.hashToken(token);

            const findToken = await AuthRepository.findByHash(refreshToken);

            if (!findToken) throw new ApiError("Token não encontrado.", 404);

            const revokedToken = await AuthRepository.revokedToken(findToken.ID);

            if (!revokedToken) throw new ApiError("Error ao revogar token.", 409);

            return revokedToken;

        } catch (err) {
            throw err;
        };
    };

    static async refresh(token: string) {
        try {
            const now = new Date();

            const refreshToken = this.hashToken(token);

            const findToken = await AuthRepository.findByHash(refreshToken);

            if (!findToken) throw new ApiError("Refresh token não encontrado.", 401);

            if (findToken.EXPIRES_AT <= now) {
                await AuthRepository.revokedToken(findToken.ID);

                throw new ApiError("Refresh token já expirado", 401)
            };

            if (findToken.REVOKED_AT) throw new ApiError("Refresh token já revogado", 401);

            const user = await UserRepository.getById(findToken?.USER_ID);

            if (!user) throw new ApiError("Nenhum usuário vinculado a esse token.", 401);

            const accessToken = jwt.sign({ sub: user.ID, email: user.EMAIL }, process.env.JWT_SECRET!, { expiresIn: `${this.FIFTEEN_MINUTES}m` });

            return { accessToken };
        } catch (err) {
            throw err;
        };
    };

    static async me(email: string) {
        try {

            const user = await UserRepository.getUserByEmail(email)

            if (!user) throw new ApiError("Usuário não encontrado.", 404);

            return {
                user: {
                    id: user?.ID,
                    name: user?.NAME,
                    email: user?.EMAIL
                },
            };

        } catch (err) {
            throw err;
        };
    };

    static async confirmEmail(userId: number) {
        try {
            const user = UserRepository.getById(userId);

            if (!user) throw new ApiError("Usuário não encontrado.", 404); 

            const emailConfirmed = await UserRepository.confirmEmail(userId);

            if (!emailConfirmed) throw new ApiError("Error ao confirmar email do usuário", 400);

            return user;

        } catch (err) {
            throw err;
        };
    };

    private static hashToken(token: string) {
        return crypto.createHash("sha256").update(token).digest("hex");
    };


    private static generateTokenHash() {
        const refreshToken = crypto.randomBytes(64).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
        return {
            refreshToken,
            tokenHash
        };
    };

    private static generateExpiresAt() {
        const expiresAt = new Date();

        expiresAt.setTime(expiresAt.getTime() + this.SEVEN_DAYS);

        return expiresAt;
    };
};