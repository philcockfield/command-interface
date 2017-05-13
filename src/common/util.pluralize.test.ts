import { expect } from 'chai';
import { singular, plural } from './util.pluralize';


describe('pluralize', () => {
  it('handles empty-string', () => {
    expect(plural('')).to.equal('');
    expect(singular('')).to.equal('');
  });

  it('handles undefined', () => {
    expect(plural()).to.equal(undefined);
    expect(singular()).to.equal(undefined);
  });

  it('handles null', () => {
    expect(plural(null)).to.equal(null);
    expect(singular(null)).to.equal(null);
  });

  it('converts to plural', () => {
    expect(plural('cat')).to.equal('cats');
    expect(plural('cat', 2)).to.equal('cats');
    expect(plural('cat', 1)).to.equal('cat');
    expect(plural('cat', 0)).to.equal('cats');
  });


  it('does not add "s" to plural of sheep', () => {
    expect(plural('sheep')).to.equal('sheep');
    expect(plural('sheep', 2)).to.equal('sheep');
    expect(plural('sheep', 1)).to.equal('sheep');
    expect(plural('sheep', 0)).to.equal('sheep');
  });


  it('singularizes a word', () => {
    expect(singular('cows')).to.equal('cow');
    expect(singular('cow')).to.equal('cow');
  });
});
