(async function () {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const detailEl = document.getElementById('event-detail');
  const form = document.getElementById('register-form');
  const msgEl = document.getElementById('register-msg');

  if (!id) {
    detailEl.innerHTML = '<p>Evento no especificado.</p>';
    form.style.display = 'none';
    return;
  }

  try {
    const ev = await Api.apiFetch(`/api/events/${id}`);
    detailEl.innerHTML = `
      <h2>${ev.title}</h2>
      <div class="meta">${ev.date} ${ev.time} · ${ev.location}</div>
      <p>${ev.description || ''}</p>
      <p><strong>Capacidad:</strong> ${ev.capacity || 0} ${ev.capacity ? 'plazas' : '(ilimitada)'}</p>
    `;
  } catch (e) {
    detailEl.innerHTML = `<p class="msg">Error: ${e.message}</p>`;
    form.style.display = 'none';
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msgEl.textContent = 'Procesando...';
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    try {
      await Api.apiFetch(`/api/events/${id}/registrations`, {
        method: 'POST',
        body: JSON.stringify({ name, email })
      });
      msgEl.style.color = 'green';
      msgEl.textContent = 'Registro exitoso. Revisa tu correo para la confirmación.';
      form.reset();
    } catch (err) {
      msgEl.style.color = 'crimson';
      msgEl.textContent = err.message;
    }
  });
})();
