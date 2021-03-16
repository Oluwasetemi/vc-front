import {capitalize, clean, toCamelCase} from '../helpers';

describe('Test for utils helpers', () => {
  it('should capitalize a string', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('should convert a string to camelCase format', () => {
    expect(toCamelCase('hello-somebody')).toBe('helloSomebody');
  });

  it('should clean an object by removing its key and value', () => {
    const obj = {name: 'test', age: null, phone: undefined};
    clean(obj);
    expect(obj).toEqual({name: 'test'});
  });
});
