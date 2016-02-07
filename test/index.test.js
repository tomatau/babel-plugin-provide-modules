import {transform} from 'babel-core'
import {expect} from 'chai'
import _ from 'lodash'
import providePlugin from '../src'

const strip = (str) => str.replace(/[\t\n\r ]+/g, '')

const exepectMatchingStrings = (actual, expected) =>
  expect(strip(actual)).to.eql(strip(expected))

const compile = (source, options) =>
  _.get(transform(source, {
    plugins: [
      [providePlugin, options]
    ]
  }), 'code')

describe('Provide Modules',() => {
  it('should add multiple default import statements', ()=> {
    const actual = compile('const hello = "hello"', {
      "package": "defaultExport",
      "require": "name",
    })
    const expected = `
      import defaultExport from "package";
      import name from "require";
      const hello = "hello";
    `
    exepectMatchingStrings(actual, expected)
  })

  it('should add destructured import statements', ()=> {
    const actual = compile('const hello = "hello"', {
      "package": "defaultExport",
      "require": ["first", "second"],
    })
    const expected = `
      import defaultExport from "package";
      import {first, second} from "require";
      const hello = "hello";
    `
    exepectMatchingStrings(actual, expected)
  })

  it('should add destructured import statements with aliases', ()=> {
    const actual = compile('const hello = "hello"', {
      "package": "defaultExport",
      "require": ["first", {"second": "s"}],
    })
    const expected = `
      import defaultExport from "package";
      import {first, second as s} from "require";
      const hello = "hello";
    `
    exepectMatchingStrings(actual, expected)
  })

  it('should add both default and destructured import statements with aliases', ()=> {
    const actual = compile('const hello = "hello"', {
      "package": {
        default: 'defaultExport',
        destructured: ["first", {"second": "s"}]
      }
    })
    const expected = `
      import defaultExport, {first, second as s} from "package";
      const hello = "hello";
    `
    exepectMatchingStrings(actual, expected)
  })

  it('shouldnt add import statements when bindings already exist', ()=> {
    const codeWithBindings = `
      const hello = "foo";
      const defaultExport = "bar";
      const first = "herp";
      const s = "derp";
    `
    const actual = compile(codeWithBindings, {
      "package": {
        default: 'defaultExport',
        destructured: ["first", {"second": "s"}]
      }
    })
    const expected = codeWithBindings;
    exepectMatchingStrings(actual, expected)
  })
})