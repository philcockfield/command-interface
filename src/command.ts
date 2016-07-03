import { ICommand } from './interfaces';
import { log } from './util';
import * as chalk from 'chalk';
import * as minimist from 'minimist';
import * as R from 'ramda';

const argv: any = minimist(process.argv.slice(2));
const maxStringLength = (strings) => Math.max.apply(null, strings.map(item => item.length));




const printCommandHelp = (name, command: ICommand) => {
  // Format sets of argument (params/flags).
  const args = Object
    .keys(command.args || {})
    .map(k => ({ name: k, description: command.args[k] }));
  const params = args.filter(item => !item.name.startsWith('-'));
  const flags = args.filter(item => item.name.startsWith('-'));
  const paramsDisplay = params.map(p => p.name).join(', ');

  // Print argument.
  const maxArgLength = maxStringLength(args.map(item => item.name.length));
  const logArg = (arg, color) => {
    const argName = `${ arg.name }${ ' '.repeat(maxArgLength) }`.substr(0, maxArgLength);
    log.info(`  ${ log[color](argName) }  ${ arg.description }`);
  };

  log.info();
  log.info(`Usage: ${ log.blue(name) } ${ chalk.magenta(paramsDisplay) }`);
  log.info.gray('------------------------------------------------------------');
  log.info(`${ command.description || 'No description.' }`);
  log.info();

  if (params.length > 0) {
    log.info.gray('Parameters:');
    params.forEach(arg => logArg(arg, 'magenta'));
    log.info();
  }

  if (params.length > 0) {
    log.info.gray('Flags:');
    flags.forEach(arg => logArg(arg, 'cyan'));
    log.info();
  }

  log.info();
};



const printCommands = (commands) => {
  const commandNames = Object.keys(commands).sort();
  const maxNameLength = maxStringLength(commandNames);

  log.info();
  log.info.cyan('Commands:\n');
  commandNames.forEach(name => {
    const { description } = commands[name];
    const paddedName = `${ name }${ ' '.repeat(maxNameLength) }`.substr(0, maxNameLength);
    log.info(`  ${ log.blue(paddedName) }  ${ log.gray(description || 'No description.') }`);
  });
  log.info();
};




/**
 * Processes and invokes a command-line instruction.
 * @param {Object} commands: The definiton of the available commands.
 */
export default (commands = {}) => {
  const commandName = argv._[0];
  const command = commands[commandName];
  const helpRequested = argv.h === true || argv.help === true;

  if (!command) {
    // No command, print the list available.
    printCommands(commands);

  } else if (command && helpRequested) {

    // Help requested for a specific command.
    printCommandHelp(commandName, command);

  } else {

    // Validate and format the arguments.
    let args = argv;
    args._.shift();
    args = { params: args._, options: args };
    delete args.options._;
    if (R.is(Function, command.validate)) {
      args = command.validate(args);
    }

    // Invoke the command.
    if (args && R.is(Function, command.action)) {
      command.action(args);
    }
  }
};
