
let listeners = [];
let backlog = [];

export const disconnect = (socket) => {
  listeners = listeners.filter(s => s !== socket);
};

export const connect = (socket) => {
  listeners.push(socket);
  socket.on('disconnect', () => disconnect(socket));
  socket.emit('backlog', { events: backlog });
};

export const send = (messages) => {
  backlog = backlog.concat(messages.filter(m => m.type !== 'time' && m.type !== 'waiting'));
  listeners.forEach(socket => socket.emit('events', { events: messages }));
};

export const reset = () => {
  listeners = [];
  backlog = [];
};
