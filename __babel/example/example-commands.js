import command from '../';


command({
  'foo': {
    description: 'A thing that does something.',
    args: {
      'param1': 'the first parameter',
      'param2': 'the second param',
      '--foo': 'a boolean flag',
    },
    validate: (args) => args,
    action: (args) => {
      console.log("action", args);
    },
  },

  'foo-bar-baz': {},
});


// command
//   .name('foo')
//   .arg('param1', 'this is a thing')
//   .arg('param2', 'this is a thing')
//   .option('--foo', 'A bolean flag')
//   .validate((args) => true)
//   .action((args) => {})
