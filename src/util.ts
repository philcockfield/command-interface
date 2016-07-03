import * as childProcess from 'child_process';
import log from 'js-util-log';

export const exec = (cmd) => childProcess.execSync(cmd, { stdio: [0, 1, 2] });
export { log };
