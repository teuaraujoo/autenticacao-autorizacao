import { resend } from "../../lib/resend";
import { welcomeTemplate } from "./templates/welcome.template";

export default class EmailService {
    static async sendWelcomeEmail(email: string, name: string) {

        try {
            const { data, error } = await resend.emails.send({
                from: `Sistema Auth <${process.env.RESEND_FROM_EMAIL}>`,
                to: email,
                subject: "Bem vindo!",
                html: welcomeTemplate(name)
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