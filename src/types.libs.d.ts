declare module 'execa' {
  const execa: any;
  export = execa;
}




interface IListrTask {
  title: string;
  task: () => void;
  skip?: () => void;
}
interface IListrOptions {
  concurrent?: boolean;
  exitOnError?: boolean;
}

declare class Listr {
  public constructor(tasks?: IListrTask[], options?: IListrOptions);
  public run(): Promise<void>;
  public add(task: IListrTask): Listr;
}

declare module 'listr' {
  export = Listr;
}

