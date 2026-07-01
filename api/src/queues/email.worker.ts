import "dotenv/config"

import { Worker } from "bullmq";
import EmailService from "../modules/email/email.services";
import { ConnectionOptions } from "bullmq";
import { createRedisConnection } from "./redis";

const worker = new Worker(

    "emails",

    async (job) => {
        console.log("Recebi job:", job.name);
        switch (job.name) {

            case "welcome-email":

                await EmailService.sendWelcomeEmail(

                    job.data.email,

                    job.data.name

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