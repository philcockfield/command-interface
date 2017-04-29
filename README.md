[![Build Status](https://travis-ci.org/philcockfield/command-interface.svg?branch=master)](https://travis-ci.org/philcockfield/command-interface)
![Title](https://cloud.githubusercontent.com/assets/185555/25554746/3374e70e-2d29-11e7-9daa-23a189385240.png)

Build powerful command-line interface from simple ES6 modules.


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


To initialize the commands, from the entry point of your module pass the path to the folder containing your command modules:

```js
import command from 'command-interface';
command('./commands/*');
```

This will load all modules directly within the given directory and produce the following list when run with no command argument:

![Index](https://cloud.githubusercontent.com/assets/185555/16539433/6c7ec6d4-4097-11e6-9cf2-55ff675839f8.png)

To do a deep recursive inclusion of all child directories, use `**`:

```js
import command from 'command-interface';
command('./commands/**');
```




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


---
### License: MIT
