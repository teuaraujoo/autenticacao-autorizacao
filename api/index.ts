import "dotenv/config"
import express from "express"

const app = express();

app.use(express.json());

app.get("/health", (_, res) => {
    res.status(200).json({
        status: "ok"
    });
});

app.listen(process.env.PORT, () => {
    console.log(`SERVIDOR RODANDO NA PORTA ${process.env.PORT}`);
});