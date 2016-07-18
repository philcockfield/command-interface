export interface IValidate {
  (args: Object): Object;
};

export interface IAction {
  (args: Object): Object;
};

export interface ICommandArgs {
  params: Array<string>;
  options: Object;
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
  args?: Object;
  validate?: IValidate;
  action: IAction;
};
