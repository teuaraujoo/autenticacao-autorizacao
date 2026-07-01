import { Queue, ConnectionOptions } from "bullmq";
import { createRedisConnection } from "../lib/redis";

export const emailQueue = new Queue("emails", {
    connection: createRedisConnection() as unknown as ConnectionOptions
});
