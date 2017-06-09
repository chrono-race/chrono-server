
function initialise() {
  let lastMessage;
  return (message) => {
    if (message.message !== undefined && message.message !== lastMessage) {
      lastMessage = message.message;
      return [{
        type: 'race_control_message',
        message: message.message,
      }];
    }
    return [];
  };
}

module.exports = { initialise };
