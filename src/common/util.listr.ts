const Listr = require('listr');

export interface IListrTask {
  title: string;
  task: () => void;
  skip?: () => void;
}
export interface IListrOptions {
  concurrent?: boolean;
  exitOnError?: boolean;
}

export interface IListr {
  run(): Promise<void>;
  add(task: IListrTask): IListr;
}

/**
 * Invokes a new listr task.
 */
export function listr(tasks?: IListrTask[], options?: IListrOptions) {
  return new Listr(tasks, options) as IListr;
}
