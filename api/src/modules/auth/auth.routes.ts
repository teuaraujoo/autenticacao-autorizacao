import express from "express"
import AuthController from "./auth.controllers";
import refreshTokenMiddleware from "../../middleware/refresh-token.middleware";
import accessTokenMiddleware from "../../middleware/access-token.middleware";
import loginLimiter from "../../lib/rate-limit";
const router = express.Router();

router.post("/login", loginLimiter, AuthController.login);
router.post("/logout", refreshTokenMiddleware, AuthController.logout);
router.post("/refresh", refreshTokenMiddleware, AuthController.refresh);
router.get("/me", accessTokenMiddleware, AuthController.me);

export default router;