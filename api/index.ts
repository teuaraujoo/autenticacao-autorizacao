import cookieParser from "cookie-parser";
import "dotenv/config"
import express from "express"
import userRoutes from "./src/modules/users/users.routes";
import authRoutes from "./src/modules/auth/auth.routes";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/health", (_, res) => {
    res.status(200).json({
        status: "ok"
    });
});

app.use("/api", authRoutes);
app.use("/api", userRoutes);

app.listen(process.env.PORT, () => {
    console.log(`SERVIDOR RODANDO NA PORTA ${process.env.PORT}`);
});