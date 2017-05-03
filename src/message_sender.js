
const listeners = [];

export const connect = (socket) => {
  listeners.push(socket);
  socket.emit('backlog', { events: [] });
};

export const send = (messages) => {
  listeners.forEach(socket => socket.emit('events', { events: messages }));
};
