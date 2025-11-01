(async function () {
  const listEl = document.getElementById('events-list');
  const form = document.getElementById('event-form');
  const msgEl = document.getElementById('form-msg');
  const btnCancel = document.getElementById('btn-cancel');

  const idEl = document.getElementById('event-id');
  const titleEl = document.getElementById('title');
  const descriptionEl = document.getElementById('description');
  const dateEl = document.getElementById('date');
  const timeEl = document.getElementById('time');
  const locationEl = document.getElementById('location');
  const capacityEl = document.getElementById('capacity');
  const adminSecretEl = document.getElementById('admin-secret');

  function renderEvents(events) {
    if (!events.length) {
      listEl.innerHTML = '<p>No hay eventos.</p>';
      return;
    }
    listEl.innerHTML = events
      .map(
        (ev) => `
      <div class="event">
        <h3>${ev.title}</h3>
        <div class="meta">${ev.date} ${ev.time} · ${ev.location}</div>
        <p>${ev.description || ''}</p>
        <div>
          <a class="btn" href="/event.html?id=${ev._id}">Ver</a>
          <button class="secondary" data-edit="${ev._id}">Editar</button>
          <button class="danger" data-del="${ev._id}">Eliminar</button>
          <button class="secondary" data-regs="${ev._id}">Ver registros</button>
        </div>
        <div id="regs-${ev._id}" class="card" style="margin-top:.5rem; display:none;"></div>
      </div>
    `
      )
      .join('');
  }

  async function loadEvents() {
    try {
      const events = await Api.apiFetch('/api/events');
      renderEvents(events);
    } catch (e) {
      listEl.innerHTML = `<p class="msg">Error al cargar: ${e.message}</p>`;
    }
  }

  function clearForm() {
    idEl.value = '';
    titleEl.value = '';
    descriptionEl.value = '';
    dateEl.value = '';
    timeEl.value = '';
    locationEl.value = '';
    capacityEl.value = '0';
    msgEl.textContent = '';
  }

  listEl.addEventListener('click', async (e) => {
    const editId = e.target.getAttribute('data-edit');
    const delId = e.target.getAttribute('data-del');
    const regsId = e.target.getAttribute('data-regs');
    const headers = adminSecretEl.value ? { 'x-admin-secret': adminSecretEl.value } : {};

    if (editId) {
      try {
        const ev = await Api.apiFetch(`/api/events/${editId}`);
        idEl.value = ev._id;
        titleEl.value = ev.title || '';
        descriptionEl.value = ev.description || '';
        dateEl.value = ev.date || '';
        timeEl.value = ev.time || '';
        locationEl.value = ev.location || '';
        capacityEl.value = ev.capacity || 0;
        msgEl.textContent = 'Editando...';
      } catch (err) {
        alert('Error: ' + err.message);
      }
    }

    if (delId) {
      if (!confirm('¿Eliminar evento?')) return;
      try {
        await Api.apiFetch(`/api/events/${delId}`, {
          method: 'DELETE',
          headers
        });
        await loadEvents();
      } catch (err) {
        alert('Error: ' + err.message);
      }
    }

    if (regsId) {
      const box = document.getElementById(`regs-${regsId}`);
      const visible = box.style.display !== 'none';
      if (visible) {
        box.style.display = 'none';
        box.innerHTML = '';
        return;
      }
      try {
        const regs = await Api.apiFetch(`/api/events/${regsId}/registrations`, { headers });
        if (!regs.length) {
          box.innerHTML = '<p>No hay registros.</p>';
        } else {
          box.innerHTML = `
            <h4>Registros (${regs.length})</h4>
            <ul>
              ${regs
                .map(
                  (r) => `<li>${r.name} - ${r.email} <span class="meta">(${new Date(
                    r.createdAt
                  ).toLocaleString()})</span></li>`
                )
                .join('')
            }
            </ul>
          `;
        }
        box.style.display = 'block';
      } catch (err) {
        box.innerHTML = `<p class="msg">Error: ${err.message}</p>`;
        box.style.display = 'block';
      }
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msgEl.textContent = 'Guardando...';

    const payload = {
      title: titleEl.value.trim(),
      description: descriptionEl.value.trim(),
      date: dateEl.value,
      time: timeEl.value,
      location: locationEl.value.trim(),
      capacity: parseInt(capacityEl.value || '0', 10)
    };

    const id = idEl.value;
    const method = id ? 'PUT' : 'POST';
    const path = id ? `/api/events/${id}` : '/api/events';
    const headers = adminSecretEl.value ? { 'x-admin-secret': adminSecretEl.value } : {};

    try {
      await Api.apiFetch(path, {
        method,
        headers,
        body: JSON.stringify(payload)
      });
      msgEl.style.color = 'green';
      msgEl.textContent = 'Guardado correctamente';
      clearForm();
      await loadEvents();
    } catch (err) {
      msgEl.style.color = 'crimson';
      msgEl.textContent = err.message;
    }
  });

  btnCancel.addEventListener('click', () => {
    clearForm();
    msgEl.textContent = 'Cancelado';
  });

  await loadEvents();
})();
