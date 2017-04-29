// tslint:disable callable-types

export interface IValidate {
  (args: object): object;
}

export interface IAction {
  (args: object): object;
}

export interface ICommandArgs {
  params: string[];
  options: object;
}

export interface IValidate {
  (args: ICommandArgs): ICommandArgs | undefined;
}

export interface IAction {
  (args: ICommandArgs): Promise<any> | undefined;
}

/**
 * Represents a single command definition.
 */
export interface ICommand {
  name: string;
  alias: string[];
  description?: string;
  group?: string;
  args?: object;
  validate?: IValidate;
  action: IAction;
}
