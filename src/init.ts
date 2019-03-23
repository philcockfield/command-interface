import command from './command';
import { R, fs, IAction, ICommand, IValidate } from './common';

/**
 * Loads a set of modules and constructs a command object.
 */
function toCommand(modulePath: string): ICommand {
  const m = require(modulePath);
  let name;
  name = m.name ? m.name : fs.basename(modulePath, '.js');
  name = name.endsWith('.cmd') ? fs.basename(name, '.cmd') : name;

  let alias = m.alias;
  if (!R.is(Array, alias)) {
    alias = [alias];
  }
  alias = R.reject(R.isNil)(alias);

  const action = m.cmd || m.default;

  return {
    name,
    alias,
    description: m.description,
    group: m.group,
    args: m.args,
    validate: m.validate as IValidate,
    action: action as IAction,
  };
}

/**
 * Loads a set of modules and constructs a command object.
 */
function toCommands(modulePaths: string[]) {
  // Retrieve and sort paths.
  const commands = modulePaths
    .map(toCommand)
    .filter(item => R.is(Function, item.action));

  // Convert to an object.
  const result = {};
  commands.forEach(cmd => (result[cmd.name] = cmd));
  return result;
}

/**
 * Converts a path/pattern to a command object
 */
async function pathToCommands(path: string) {
  const paths = await fs.glob.find(path);
  return toCommands(paths);
}

export default async (
  param: string | string[] | { [key: string]: ICommand },
) => {
  // A string was passed, assume it was a path or path-pattern.
  // Convert it to a command object.
  if (typeof param === 'string') {
    param = await pathToCommands(param);
  }

  // A list of string was passed, assuming it was a list of path/patterns.
  // Merge all the cmds found into one command object. Later cmds override earlier commands.
  if (Array.isArray(param)) {
    let out = {};
    for (const path of param) {
      out = {
        ...out,
        ...(await pathToCommands(path)),
      };
    }
    param = out;
  }

  // Process commands.
  command(param);
};
