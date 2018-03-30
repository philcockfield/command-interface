import { expect } from 'chai';
import { fsPath } from './libs';
import * as file from './util.file';

describe('file.yaml', () => {
  it('loads a yaml file', async () => {
    const path = fsPath.join(__dirname, '../examples/sample.yaml');
    const result = await file.yaml<any>(path);
    expect(result.array).to.be.an.instanceof(Array);
    expect(result.array.length).to.equal(3);
  });
});
