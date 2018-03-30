import { expect } from 'chai';
import { listr } from './util.listr';

describe('listr', () => {
  it('exists', () => {
    const list = listr([
      {
        title: 'task-1',
        task: () => undefined,
      },
    ]);

    list.add({
      title: 'task-2',
      task: () => undefined,
    });

    expect((list as any)._tasks.length).to.equal(2);
  });
});
