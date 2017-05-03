
let listeners = [];
let backlog = [];

export const connect = (socket) => {
  listeners.push(socket);
  socket.emit('backlog', { events: backlog });
};

export const disconnect = (socket) => {
  listeners = listeners.filter(s => s !== socket);
};

export const send = (messages) => {
  backlog = backlog.concat(messages);
  listeners.forEach(socket => socket.emit('events', { events: messages }));
};

export const reset = () => {
  listeners = [];
  backlog = [];
};
