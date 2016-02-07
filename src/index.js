import {forEachRight, isEmpty, isObject, isArray, reverse, map, keys, values, compact} from 'lodash'

export default function({ types: t }) {
  const addImport = (node, specifiers, module) =>
    node.body.unshift(t.importDeclaration(specifiers, t.stringLiteral(module)))
  const defaultImport = (binding, scope) =>
    !scope.hasBinding(binding) && t.importDefaultSpecifier(t.identifier(binding))
  const destructuredImport = (right, left, scope) => {
    return !scope.hasBinding(right) && t.importSpecifier(t.identifier(right), t.identifier(left))
  }

  const makeSpecifiers = (bindings, scope) => {
    switch(true) {
      case isArray(bindings):
        return map(bindings, binding =>
          destructuredImport(
            ...isObject(binding)
              ? [ values(binding)[0], keys(binding)[0], scope ]
              : [ binding, binding, scope ]
          )
        )
      case isObject(bindings):
        return [
          ...makeSpecifiers(bindings.default, scope),
          ...makeSpecifiers(bindings.destructured, scope),
        ]
      default:
        return [ defaultImport(bindings, scope) ];
    }
  }

  return {
    visitor: {
      Program: {
        exit({ node, scope }, { opts }) {
          if (isEmpty(opts))
            return
          forEachRight(opts, (bindings, module) => {
            const specifiers = compact(makeSpecifiers(bindings, scope))
            if (specifiers.length) addImport(node, specifiers, module)
          })
        }
      }
    }
  }
}