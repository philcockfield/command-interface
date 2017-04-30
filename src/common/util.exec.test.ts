import { expect } from 'chai';
import * as exec from './util.exec';


describe('listr', () => {
  it('invokes a shell command', async () => {
    const result = await exec.run('echo foo');
    expect(result.code).to.equal(0);
    expect(result.stdout).to.equal('foo');
  });
});

