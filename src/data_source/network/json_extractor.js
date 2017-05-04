
function process(input) {
  const cleanedInput = input.toString().replace(/\n/g, ' ').replace(/\r/g, '');
  const regex = /SP._input_\('(.*?)',(.*?)\);/g;
  let match = regex.exec(cleanedInput);
  const result = {};
  while (match != null) {
    const name = match[1];
    const json = match[2];
    result[name] = JSON.parse(json);
    match = regex.exec(cleanedInput);
  }
  return result;
}

module.exports = { process };
