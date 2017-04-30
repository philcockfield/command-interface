[![Build Status](https://travis-ci.org/philcockfield/command-interface.svg?branch=master)](https://travis-ci.org/philcockfield/command-interface)
![Title](https://cloud.githubusercontent.com/assets/185555/25560798/7c630472-2db1-11e7-861f-8e3ceaca216b.png)

Build powerful command-line interfaces from simple ES6 modules.


## Usage
Each command is defined within an ES module like so:

```js
// commands/foo.cmd.js

export const name = 'foo';
export const description = 'A thing that does something.';
export const alias = 'f'; // String or Array.
export const group = 'Utilities';

export const args = {
  'param1': 'the first parameter',
  'param2': 'the second param',
  '--foo': 'a boolean flag',
};

export const validate = (args) => args;

export default (args) {
  // Run the command.
};
```

All exports are optional. If a `name` is omitted the name of the module is assumed.  The only thing you really need is the `default export` function to invoke when the command is run.

If you don't wish to export the command as a default export, your can export a function named `cmd`, eg:

```js
export async function cmd(args) {
  // Run the command.
}
```


To initialize the CLI, from the entry point of your module pass a [glob pattern](https://en.wikipedia.org/wiki/Glob_(programming)) representing your JS modules that are commands.  Typically these have a `.cmd.js` suffix:

```js
import command from 'command-interface';
command('./**/*.cmd.js');
```

This will load all modules with the `.cmd.js` suffix anywhere within the project and produce the following index list when run with no command argument:

![Index](https://cloud.githubusercontent.com/assets/185555/16539433/6c7ec6d4-4097-11e6-9cf2-55ff675839f8.png)





#### Command Help
To get details on a specific command:

    node . foo -h

![Command Help](https://cloud.githubusercontent.com/assets/185555/16544978/6d9f6b2c-416e-11e6-8574-0ec42bc04e64.png)


#### Run a Command

    node . foo param1 flag=123 -f

The parameter and option arguments are passed to the command function as the `args` parameter.  

```js
{
  args: ['param1'],
  options: { flag: 123, f: true },
}
```

See [minimist](https://github.com/substack/minimist) for more.

## Example

    cd lib/examples
    node .



## Tests

    npm test

## Usages

- [msync](https://github.com/philcockfield/msync) - A powerful toolkit for building and syncing multiple node-modules in a flexibly defined workspace.

- [new-file](https://github.com/philcockfield/new-file) - Simple file templates.
