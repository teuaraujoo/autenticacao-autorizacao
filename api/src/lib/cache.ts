import { createRedisConnection } from "./redis";

export class CacheService {
    private redis = createRedisConnection();

    async get<T>(key: string): Promise<T | null> {
        const value = await this.redis.get(key);

        if (!value) return null;

        return JSON.parse(value);
    }

    async set(key: string, value: unknown, ttl = 300) {
        await this.redis.set(
            key,
            JSON.stringify(value),
            "EX", // informa para expirar em segundos (existem outros que soa em milesegundos, timestamp....)
            ttl // ttl -> Time to Live (tempo de vida)
        )
    }

    async delete(key: string) {
        await this.redis.del(key);
    };
};

export const cache = new CacheService();