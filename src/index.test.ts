import { expect } from 'chai';
import { table, log } from '.';

describe('api', () => {
  it('exports table helper', () => {
    expect(table).to.be.an.instanceof(Function);
  });

  it('exports log', async () => {
    expect(log.info).to.be.an.instanceof(Function);
  });
});
