import morgan from 'morgan';
import chalk from 'chalk'; // or you can use the require('chalk') syntax too

const colorizedMorgan = morgan((tokens, req, res) => {
  // **********************************************
  // Status
  const status = tokens.status(req, res);
  let statusText = chalk.bold(status);
  if (status && status.startsWith('2')) statusText = chalk.green.bold(status);
  if (status && status.startsWith('4')) statusText = chalk.hex('#ffb142').bold(status);
  if (status && status.startsWith('5')) statusText = chalk.bgRed.bold(status);

  // **********************************************
  // Content Length
  const cl = tokens.res(req, res, 'content-length');
  const contnetLength = chalk.yellow.bold(cl || 0, 'byte ->');

  return [
    '',
    chalk.cyan.bold(tokens.method(req, res)),
    statusText,
    chalk.cyanBright.bold(tokens.url(req, res)),
    contnetLength,
    chalk.hex('#2ed573').bold(`${tokens['response-time'](req, res)} ms`),
    process.env.NODE_ENV === 'production' ? chalk.hex('#adf573').bold(tokens['remote-addr'](req, res)) : undefined,
    chalk.hex('#e1d573').bold(`[${tokens.date(req, res).toLocaleString()}]`),
  ].join(' ');
});

export default colorizedMorgan;
