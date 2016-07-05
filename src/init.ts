import command from './command';
import { IAction, ICommand, IValidate } from './interfaces';
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

    // Just the JS files.
    paths = items.filter(p => p.endsWith('.js'));

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

  return {
    name,
    description: m.description,
    group: m.group,
    args: m.args,
    validate: <IValidate> m.validate,
    action: <IAction> m.default,
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




export default (param) => {
  // A string was passed, assume it was a path or path-pattern.
  // Convert it to a command object.
  if (R.is(String, param)) {
    const paths = toModulePaths(param);
    param = toCommands(paths);
  }

  // Process commands.
  command(param);
};
