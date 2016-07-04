import * as childProcess from 'child_process';
import log from 'js-util-log';
import * as R from 'ramda';


const exec = (cmd) => childProcess.execSync(cmd, { stdio: [0, 1, 2] });
export { exec, log };
export const DEFAULT_GROUP = '__default__';





/**
 * Converts a set of commands into a grouped object.
 */
export function toGroupedCommands(commands) {
  // Convert to an array.
  const commandList = Object.keys(commands).map(key => commands[key]);

  // Sort into groups.
  const groups = R.uniq(commandList.map(cmd => cmd.group || DEFAULT_GROUP)).sort();
  const grouped = { __default__: {} };
  groups.forEach(group => grouped[group] = {});

  groups.forEach(group => {
    const isInGroup = (cmd) => (cmd.group || DEFAULT_GROUP) === group;
    const groupCommands = R.sortBy(R.prop('name'), commandList.filter(isInGroup));
    groupCommands.forEach(cmd => grouped[group][cmd.name] = cmd);
  });

  // Finish up.
  return grouped;
}
