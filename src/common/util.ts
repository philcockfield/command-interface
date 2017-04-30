import * as constants from './constants';
import { R } from './libs';
import { ICommand } from '../types';




export const compact = <T>(value: T[]) => R.pipe(
  R.reject(R.isNil),
  R.reject(R.isEmpty),
)(value) as T[];






/**
 * Converts a set of commands into a grouped object.
 */
export function toGroupedCommands(commands: object) {
  // Convert to an array.
  const commandList = Object.keys(commands).map((key) => commands[key] as ICommand);

  // Sort into groups.
  const groups = R.uniq(commandList.map((cmd) => cmd.group || constants.DEFAULT_GROUP)).sort();
  const grouped = { __default__: {} };
  groups.forEach((group) => grouped[group] = {});

  groups.forEach((group) => {
    const isInGroup = (cmd: ICommand) => (cmd.group || constants.DEFAULT_GROUP) === group;
    const groupCommands = R.sortBy(R.prop('name'), commandList.filter(isInGroup));
    groupCommands.forEach((cmd) => grouped[group][cmd.name] = cmd);
  });

  // Finish up.
  return grouped;
}
