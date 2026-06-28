import { rateLimit } from "express-rate-limit";

const loginLimiter = rateLimit({
    windowMs: 3 * 60 * 1000,
    max: 5,
    message: { message: "Muitas tentativas de login. Por favor tente novamente mais tarde." },
    standardHeaders: "draft-8",
    legacyHeaders: false
});

export default loginLimiter;