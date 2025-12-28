/* app.js - shared client-side logic for demo ticket system
   Place this file alongside the HTML and CSS files.
*/
(function(){
  // exported helpers (attach to window)
  function uid() {
    // short unique id: timestamp + random
    return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,8);
  }

  function readStorage() {
    try {
      const raw = localStorage.getItem('tickets_v1');
      return raw ? JSON.parse(raw) : [];
    } catch(e) {
      console.error('storage read error', e);
      return [];
    }
  }

  function writeStorage(arr) {
    try {
      localStorage.setItem('tickets_v1', JSON.stringify(arr));
    } catch(e) {
      console.error('storage write error', e);
    }
  }

  function getTickets() {
    return readStorage();
  }

  function saveTicket(data) {
    const t = {
      id: uid(),
      title: data.title,
      description: data.description,
      priority: data.priority || 'medium',
      contact: data.contact || '',
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const all = readStorage();
    all.push(t);
    writeStorage(all);
    return t.id;
  }

  function getTicketById(id) {
    const all = readStorage();
    return all.find(x => x.id === id) || null;
  }

  function updateTicket(ticket) {
    const all = readStorage();
    const i = all.findIndex(x => x.id === ticket.id);
    if (i === -1) return false;
    ticket.updatedAt = new Date().toISOString();
    all[i] = ticket;
    writeStorage(all);
    return true;
  }

  function deleteTicket(id) {
    let all = readStorage();
    all = all.filter(x => x.id !== id);
    writeStorage(all);
  }

  function clearTickets() {
    writeStorage([]);
  }

  // attach to window so pages can call
  window.getTickets = getTickets;
  window.saveTicket = saveTicket;
  window.getTicketById = getTicketById;
  window.updateTicket = updateTicket;
  window.deleteTicket = deleteTicket;
  window.clearTickets = clearTickets;
})();

