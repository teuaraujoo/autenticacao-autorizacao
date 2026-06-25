import express  from "express"
import AuthController from "./auth.controllers";
const router = express.Router();

router.post("/", AuthController.create)
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);