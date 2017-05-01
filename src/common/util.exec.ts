import { Subject } from './libs';
const execa = require('execa');


export interface IRunOptions {
  silent?: boolean;
}


/**
 * Runs the given command.
 */
export function run(command: string, options: IRunOptions = {}) {
  return invoke(command, options);
}


export interface IResponse {
  text: string;
  isError: boolean;
}


/**
 * Runs the command as an observable.
 */
export function run$(command: string) {
  const subject = new Subject<IResponse>();
  const child = invoke(command, { silent: true });

  const next = (data: Buffer, isError: boolean) => subject.next({
    text: data.toString(),
    isError,
  });
  child.stdout.on('data', (data: Buffer) => next(data, false));
  child.stderr.on('data', (data: Buffer) => next(data, true));

  return subject;
}



function invoke(cmd: string, options: IRunOptions = {}) {
  const { silent = false } = options;

  // Invoke the command.
  const promise = execa.shell(cmd);

  // Write to console.
  if (!silent) {
    promise.stdout.pipe(process.stdout);
  }

  // Finish up.
  return promise;
}


/**
 * Opens a new tab in iTerm and executes the given command.
 */
export async function inNewTab(cmd: string, path: string) {

  // Prepare the command to open a new terminal.
  const command = `osascript -e '
    if application "iTerm" is running then
      tell application "iTerm"
          tell current window
              create tab with default profile
              tell current session
                  write text "cd ${path} && clear && ${cmd}"
              end tell
          end tell
      end tell
    else
        activate application "iTerm"
    end if
  '`;

  // Execute the command.
  return run(command, { silent: true });
}
