import findSessionBlock from './find_session_block';
import serverConfig from '../../server_config';

function extractDrivers(input) {
  const drivers = [];
  const sessionName = findSessionBlock.from(input.init);
  const lastYearsTeamOrder = serverConfig.lastYearsTeamOrder;

  input.init[sessionName].Drivers.forEach((element) => {
    drivers.push({
      tla: element.Initials,
      color: element.Color,
      team: element.Team,
      number: element.Num,
      teamOrder: lastYearsTeamOrder.findIndex(x => x === element.Team),
    });
  });

  return drivers;
}

module.exports = { extractDrivers };
