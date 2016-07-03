import log from 'js-util-log';
import * as childProcess from 'child_process';

export const exec = (cmd) => childProcess.execSync(cmd, { stdio: [0, 1, 2] });
export { log };
