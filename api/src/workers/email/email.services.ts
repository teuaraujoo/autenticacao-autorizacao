import { resend } from "../../lib/resend";
import { confirmEmailTemplate } from "./templates/confirm-email.template";

export default class EmailService {
    static async sendConfirmEmail(email: string, name: string, userId: number) {

        try {
            const { data, error } = await resend.emails.send({
                from: `Sistema Auth <${process.env.RESEND_FROM_EMAIL}>`,
                to: email,
                subject: "Bem vindo!",
                html: confirmEmailTemplate(name, userId)
            });

            if (error) {
                console.error("Error retornado do console resend: ", error);
                throw error;
            };

            console.log("Email enviado com sucesso: ", data);

        } catch (err) {
            console.error("Error ao enviar email.", err);
            throw err;
        };
    };
};