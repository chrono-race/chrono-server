
let listeners = [];

export const connect = (socket) => {
  listeners.push(socket);
  socket.emit('backlog', { events: [] });
};

export const disconnect = (socket) => {
  listeners = listeners.filter(s => s !== socket);
};

export const send = (messages) => {
  listeners.forEach(socket => socket.emit('events', { events: messages }));
};
