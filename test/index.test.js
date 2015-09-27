import * as babel from 'babel';
import {expect} from 'chai';
import providePlugin from '../src';

const strip = (str) => str.replace(/[\t\n\r ]+/g, '')

const exepectMatchingStrings = (actual, expected) =>
  expect(strip(actual)).to.eql(strip(expected))

let transform;
describe('Test',()=>{
  beforeEach(()=>{
    transform = (code, modules) =>
      babel.transform(code, {
        blacklist: ['strict', 'es6.modules', 'es6.classes'],
        plugins: [
          providePlugin
        ],
        extra: {
          "provide-modules": modules
        }
      }).code;
  });

  it('should add an import statement',()=>{
    const modules = {
      "Thing": "something"
    };
    const actual = transform('const hello = "hello"', modules);
    const expected = `
      import Thing from "something";
      var hello = "hello";`
    exepectMatchingStrings(actual, expected)
  });

  it('should add import statements in reverse order',()=>{
    const modules = {
      "React": "react",
      "log": "npmlog"
    };
    const actual = transform('const hello = "hello"', modules);
    const expected = `
      import log from "npmlog";
      import React from "react";
      var hello = "hello";`
    exepectMatchingStrings(actual, expected)
  });
});