// export const name = 'another-name';

export const description = 'A thing that does something.';
export const alias = ['f', 'ff'];

export const args = {
  'param1': 'the first parameter',
  'param2': 'the second param',
  '--foo': 'a boolean flag',
};

export const validate = (args) => args;

export default (args) => {
  console.log('foo', args, '\n');
};
