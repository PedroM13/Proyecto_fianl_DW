function registrationEmailTemplate({ name, event }) {
  const fullDate = `${event.date} ${event.time}`;
  const title = event.title;
  const location = event.location;

  return {
    subject: `Confirmación de registro: ${title}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.5; color:#111">
        <h2>¡Registro confirmado!</h2>
        <p>Hola ${name},</p>
        <p>Te has registrado correctamente en el evento:</p>
        <ul>
          <li><strong>Título:</strong> ${title}</li>
          <li><strong>Fecha y hora:</strong> ${fullDate}</li>
          <li><strong>Ubicación:</strong> ${location}</li>
        </ul>
        <p>Gracias por tu interés. ¡Te esperamos!</p>
        <hr/>
        <p style="font-size:12px;color:#666">Este correo es automático, no respondas a este mensaje.</p>
      </div>
    `
  };
}

module.exports = { registrationEmailTemplate };
