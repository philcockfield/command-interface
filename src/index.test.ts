import { expect } from 'chai';
import { log } from '.';

describe('api', () => {
  it('exports log', async () => {
    expect(log.info).to.be.an.instanceof(Function);
  });

  it('exports table helper', () => {
    expect(log.table).to.be.an.instanceof(Function);
  });
});
