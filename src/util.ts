import * as childProcess from 'child_process';
import log from 'js-util-log';

const exec = (cmd) => childProcess.execSync(cmd, { stdio: [0, 1, 2] });
export { exec, log };
