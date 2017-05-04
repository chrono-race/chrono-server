import findSessionBlock from './find_session_block';

function extractDrivers(input) {
  const drivers = [];
  const sessionName = findSessionBlock.from(input.init);
  input.init[sessionName].Drivers.forEach((element) => {
    drivers.push({
      tla: element.Initials,
      color: element.Color,
      team: element.Team,
      number: element.Num,
    });
  });

  return drivers;
}

module.exports = { extractDrivers };
