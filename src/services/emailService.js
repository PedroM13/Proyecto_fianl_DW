const { Resend } = require('resend');
const { registrationEmailTemplate } = require('./templates/registrationEmail');

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

/**
 * Enviar email de confirmación de registro
 * Fallback: si no hay RESEND_API_KEY, imprime el contenido en consola
 */
async function sendRegistrationEmail(to, event, registration) {
  const from = process.env.EMAIL_FROM || 'no-reply@example.com';
  const client = getResendClient();
  const { subject, html } = registrationEmailTemplate({ name: registration.name, event });

  if (!client) {
    console.log('Simulating email send (no RESEND_API_KEY configured):');
    console.log({ from, to, subject, htmlSnippet: html.slice(0, 200) + '...' });
    return;
  }

  await client.emails.send({
    from,
    to,
    subject,
    html
  });
}

module.exports = { sendRegistrationEmail };
