import cookieParser from "cookie-parser";
import "dotenv/config"
import express from "express"
import userRoutes from "./src/modules/users/users.routes";
import authRoutes from "./src/modules/auth/auth.routes";
import helmet from "helmet";
import { errorHandler } from "./src/middleware/error.middleware";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.get("/health", (_, res) => {
    res.status(200).json({
        status: "ok"
    });
});

app.use("/api", authRoutes);
app.use("/api/users", userRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`SERVIDOR RODANDO NA PORTA ${PORT}`);
});