import cookieParser from "cookie-parser";
import "dotenv/config"
import express from "express"
import userRoutes from "./modules/users/users.routes";
import authRoutes from "./modules/auth/auth.routes";
import helmet from "helmet";
import compression from "compression";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(compression());

app.get("/health", (_, res) => {
    res.status(200).json({
        status: "ok"
    });
});

app.use("/api", authRoutes);
app.use("/api/users", userRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`SERVIDOR RODANDO NA PORTA ${PORT}`);
});