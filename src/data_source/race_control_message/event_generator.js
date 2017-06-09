
function initialise() {
  return (message) => {
    if (message.message !== undefined) {
      return [{
        type: 'race_control_message',
        message: message.message,
      }];
    }
    return [];
  };
}

module.exports = { initialise };
