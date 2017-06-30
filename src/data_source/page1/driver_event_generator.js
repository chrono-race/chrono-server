
function generateDriverEvent(drivers) {
  return [{
    type: 'drivers',
    drivers,
  }];
}

export default generateDriverEvent;
