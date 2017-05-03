
const listeners = [];

export const connect = (socket) => {
  listeners.push(socket);
  socket.emit('backlog', { events: [] });
};

export const send = (message) => {
  listeners.forEach(socket => socket.emit('events', { events: [message] }));
};
