
export const connect = (socket) => {
  socket.emit('backlog', { events: [] });
};

export const send = () => {

};
