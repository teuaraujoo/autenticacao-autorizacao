import "dotenv/config";

export function confirmEmailTemplate(name: string, userId: number) {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Bem-vindo!</title>
</head>

<body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:40px 20px;">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:16px;padding:48px;box-shadow:0 8px 20px rgba(0,0,0,.08);">

<tr>
<td align="center">

<h1 style="margin:0;color:#111827;">
Bem-vindo, ${name}!
</h1>

<p style="margin-top:24px;color:#4b5563;font-size:16px;line-height:1.8;">
Sua conta foi criada com sucesso.
Para poder acessar a plataforma e aproveitar todos os recursos disponíveis, confirme seu email no botão abaixo:
</p>

<a
href="${process.env.API_URL}/api/confirm-email/${userId} "
style="
display:inline-block;
margin-top:32px;
padding:14px 28px;
background:#2563eb;
color:white;
text-decoration:none;
border-radius:8px;
font-weight:bold;
">
Confirmar Email
</a>

<hr style="margin:48px 0;border:none;border-top:1px solid #e5e7eb;">

<p style="color:#9ca3af;font-size:13px;">
Caso você não tenha criado essa conta, ignore este e-mail.
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
}