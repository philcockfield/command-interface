import command from './command';
import { IAction, ICommand, IValidate } from './types';
import * as fs from 'fs';
import * as fsPath from 'path';
import * as R from 'ramda';



const isDirectory = (path) => fs.lstatSync(path).isDirectory();



/**
 * Converts a parameter string passed to the module to a
 * set of module paths.
 */
function toModulePaths(param: string): Array<string> {
  let paths;
  param = param.endsWith('/') ? param += '*' : param;

  if (param.endsWith('*')) {
    // Wild-card, get all files in the folder.
    const dir = fsPath.resolve(fsPath.dirname(param));
    const items = fs
      .readdirSync(dir)
      .map(p => fsPath.join(dir, p));

    // Just the JS or TS files.
    paths = items.filter(p => p.endsWith('.js') || p.endsWith('.ts'));

    // Deep wild-card specified, search child-folders (RECURSION).
    if (param.endsWith('**')) {
      const children = items
        .filter(p => isDirectory(p))
        .map(p => toModulePaths(fsPath.join(p, '**')));
      paths.push(children);
      paths = R.flatten(paths);
    }

  } else {
    // A single path was specified.  Return it as a single-item array.
    paths = [fsPath.resolve(param)];
  }
  return paths;
}




/**
 * Loads a set of modules and constructs a command object.
 */
function toCommand(modulePath: string): ICommand {
  const m = require(modulePath);
  let name;
  name = m.name ? m.name : fsPath.basename(modulePath, '.js');
  name = name.endsWith('.cmd') ? fsPath.basename(name, '.cmd') : name;

  let alias = m.alias;
  if (!R.is(Array, alias)) { alias = [alias]; }
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
function toCommands(modulePaths: Array<string>) {
  // Retrieve and sort paths.
  let commands = modulePaths
    .map(toCommand)
    .filter(item => R.is(Function, item.action));

  // Convert to an object.
  const result = {};
  commands.forEach(cmd => result[cmd.name] = cmd);
  return result;
}

/**
 * Converts a path/pattern to a command object
 */
function pathToCommands(path: string) {
  const paths = toModulePaths(path);
  return toCommands(paths);
}


export default (param: string | string[] | { [key: string]: ICommand }) => {
  // A string was passed, assume it was a path or path-pattern.
  // Convert it to a command object.
  if (typeof param === 'string') {
    param = pathToCommands(param);
  }

  // A list of string was passed, assuming it was a list of path/patterns.
  // Merge all the cmds found into one command object. Later cmds override earlier commands.
  if (Array.isArray(param)) {
    let out = {};
    param.forEach(path => {
      out = R.merge(out, pathToCommands(path));
    });
    param = out;
  }

  // Process commands.
  command(param);
};
