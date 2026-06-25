import cookieParser from "cookie-parser";
import "dotenv/config"
import express from "express"

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/health", (_, res) => {
    res.status(200).json({
        status: "ok"
    });
});

app.use("/api");

app.listen(process.env.PORT, () => {
    console.log(`SERVIDOR RODANDO NA PORTA ${process.env.PORT}`);
});