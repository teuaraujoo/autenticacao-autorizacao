import "dotenv/config"

import { Worker } from "bullmq";
import EmailService from "./email.services";
import { ConnectionOptions } from "bullmq";
import { createRedisConnection } from "../../lib/redis";

const worker = new Worker(

    "emails",

    async (job) => {
        console.log("Recebi job:", job.name);
        switch (job.name) {

            case "confirm-email":

                await EmailService.sendConfirmEmail(

                    job.data.email,

                    job.data.name,

                    job.data.userId

                );

                break;

        }
    },
    {
        connection: createRedisConnection() as unknown as ConnectionOptions
    }
);

worker.on("completed", (job) => {
    console.log("✅", job.id);
});

worker.on("failed", (job, err) => {
    console.error("❌", job?.id);
    console.error(err);
});