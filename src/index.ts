import command from './command';
import { IAction, ICommand, IValidate } from './interfaces';
import * as fs from 'fs';
import * as path from 'path';
import * as R from 'ramda';




/**
 * Converts a parameter string passed to the module to a
 * set of module paths.
 */
export const toModulePaths = (param: string): Array<string> => {
  let paths;
  param = param.endsWith('/') ? param += '*' : param;
  if (param.endsWith('*')) {
    const dir = path.dirname(param);
    paths = fs
      .readdirSync(dir)
      .map(p => path.join(dir, p))
      .filter(p => p.endsWith('.js'));
  } else {
    paths = [param];
  }
  return paths;
};




/**
 * Loads a set of modules and constructs a command object.
 */
const toCommand = (modulePath: string): ICommand => {
  const m = require(modulePath);
  const name = m.name ? m.name : path.basename(modulePath, '.js');
  return {
    name,
    description: m.description,
    args: m.args,
    validate: <IValidate> m.validate,
    action: <IAction> m.default,
  };
};




/**
 * Loads a set of modules and constructs a command object.
 */
const toCommands = (modulePaths: Array<string>) => {
  const result = {};
  modulePaths
    .map(toCommand)
    .forEach(cmd => result[cmd.name] = cmd);
  return result;
};




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
