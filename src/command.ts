import { ICommand, ICommandArgs } from './types';
import { constants, log, toGroupedCommands } from './common';
import { minimist, R } from './common';

const argv: any = minimist(process.argv.slice(2));
const maxStringLength = (strings: string[]) => Math.max.apply(null, strings.map((item) => item.length));


export interface IArgument {
  name: string;
  description: string;
}



/**
 * Prints the help output for a single command.
 */
function printCommandHelp(name: string, command: ICommand) {
  // Format sets of argument (params/flags).
  const args: IArgument[] = Object
    .keys(command.args || {})
    .map((k) => ({ name: k, description: command.args ? command.args[k] : '' }));
  const params = args.filter((item) => !item.name.startsWith('-'));
  const flags = args.filter((item) => item.name.startsWith('-'));
  const paramsDisplay = params.map((p) => p.name).join(', ');

  // Print argument.
  const maxArgLength = maxStringLength(args.map((item) => item.name));
  const logArg = (arg: IArgument, color: string) => {
    const argName = `${arg.name}${' '.repeat(maxArgLength)}`.substr(0, maxArgLength);
    log.info(`  ${log[color](argName)}  ${arg.description}`);
  };

  log.info();
  log.info(`Usage: ${log.blue(name)} ${log.magenta(paramsDisplay)}`);
  log.info.gray('------------------------------------------------------------');
  log.info(`${command.description || 'No description.'}`);
  log.info();

  if (params.length > 0) {
    log.info.gray('Parameters:');
    params.forEach((arg) => logArg(arg, 'magenta'));
    log.info();
  }

  if (flags.length > 0) {
    log.info.gray('Flags:');
    flags.forEach((arg) => logArg(arg, 'cyan'));
    log.info();
  }

  log.info();
}



function toDisplayName(command: ICommand) {
  const { alias, name } = command;
  let displayName = name;
  if (alias.length > 0) {
    displayName = `${displayName} (${alias.join(',')})`;
  }
  return displayName;
}



/**
 * Prints a set of commands to screen.
 */
function printCommands(commands: object, maxNameLength: number) {
  const commandNames = Object.keys(commands).sort();
  commandNames.forEach((name) => {
    const command = commands[name];
    const { description } = command;
    const displayName = toDisplayName(command);
    const paddedName = `${displayName}${' '.repeat(maxNameLength)}`.substr(0, maxNameLength);
    log.info(`   ${log.blue(paddedName)}  ${log.gray(description || 'No description.')}`);
  });
}



/**
 * Prints the list of commands within groups.
 */
function printGroups(commands: object) {
  // Calculate the longest name from all the commands.
  // This allows spacing to be lined up for all groups.
  const displayNames = Object.keys(commands).map((k) => toDisplayName(commands[k]));
  const maxNameLength = maxStringLength(displayNames);

  // Put commands into groups then print each group.
  const groups = toGroupedCommands(commands);
  Object.keys(groups).forEach((group) => {
    if (group !== constants.DEFAULT_GROUP) {
      log.info();
      log.info.gray(` ${group}`);
      log.info();
    }
    printCommands(groups[group], maxNameLength);
  });
}



/**
 * Looks up the command with the given name/alias.
 */
function findCommand(name: string, commands: object): ICommand | undefined {
  name = name || '';
  name = name.trim();

  // Look for direct name.
  if (commands[name]) {
    return commands[name];
  }
  // Look for alias.
  return Object
    .keys(commands)
    .map((key) => commands[key])
    .find((cmd) => cmd.alias.includes(name));
}


/**
 * Processes and invokes a command-line instruction.
 * @param {Object} commands: The definiton of the available commands.
 */
export default (commands = {}) => {
  const commandName = argv._[0];
  const command = findCommand(commandName, commands);
  const helpRequested = argv.h === true || argv.help === true;

  if (command === undefined) {
    // No command, print the list available.
    log.info();
    log.info.cyan('Commands:\n');
    printGroups(commands);
    log.info();
    log.info();
    return;

  } else if (command && helpRequested) {

    // Help requested for a specific command.
    printCommandHelp(commandName, command);

  } else {

    // Validate and format the arguments.
    const args = argv;
    args._.shift();
    let commandArgs: ICommandArgs | undefined = { params: args._, options: args };
    delete args._;
    if (command.validate && R.is(Function, command.validate)) {
      commandArgs = command.validate(commandArgs);
    }

    // Invoke the command.
    if (commandArgs && R.is(Function, command.action)) {
      try {
        const result = command.action(commandArgs);

        // Log async errors if a Promise was returned.
        if (result && R.is(Function, result.catch)) {
          result.catch((err) => log.error(err, '\n'));
        }

      } catch (err) {
        // Command failed.
        log.error(err, '\n');
      }
    }
  }
};
