export const group = 'errors';

export default async () => {
  throw new Error('My async error.');
};
