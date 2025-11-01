(async function () {
  const listEl = document.getElementById('events-list');

  function eventCard(ev) {
    const url = `/event.html?id=${ev._id}`;
    return `
      <div class="event">
        <h3>${ev.title}</h3>
        <div class="meta">${ev.date} ${ev.time} · ${ev.location}</div>
        <p>${ev.description || ''}</p>
        <a class="btn" href="${url}">Ver detalles</a>
      </div>
    `;
  }

  try {
    const events = await Api.apiFetch('/api/events');
    if (!events.length) {
      listEl.innerHTML = '<p>No hay eventos todavía.</p>';
      return;
    }
    listEl.innerHTML = events.map(eventCard).join('');
  } catch (e) {
    listEl.innerHTML = `<p class="msg">Error al cargar eventos: ${e.message}</p>`;
  }
})();
