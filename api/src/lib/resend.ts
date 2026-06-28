import { Resend } from "resend";
import { Request, Response } from "express";

export const resend = new Resend(process.env.RESEND_API_KEY);