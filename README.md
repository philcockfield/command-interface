# command-interface
[![Build Status](https://travis-ci.org/philcockfield/command-interface.svg?branch=master)](https://travis-ci.org/philcockfield/command-interface)

A pretty command-line interface helper.


## Usage
Each command is defined within an ES module like so:

```js
// commands/foo.js

export const name = 'foo';
export const description = 'A thing that does something.';

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

To initialize the commands, from the entry point of your module pass the path to the folder containing your command modules:

```js
import command from 'command-interface';
command('./commands/*');
```

This will load all modules within the given directory and produce the following list when run with no command argument:

![Index](https://cloud.githubusercontent.com/assets/185555/16539433/6c7ec6d4-4097-11e6-9cf2-55ff675839f8.png)

#### Command Help
To get details on a specific command:

    node . foo -h

![Command Help](https://cloud.githubusercontent.com/assets/185555/16539455/f0c95f12-4097-11e6-94d5-790871cdac89.png)


#### Run a Command

    node . foo param1 flag=123

The parameter and flag arguments are passed to the command function as the `args` parameter.  See [minimist](https://github.com/substack/minimist) for more.

## Example

    cd lib/examples
    node .



## Tests

    npm test


---
### License: MIT
