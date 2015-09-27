const isEmptyObject = (obj={}) =>
  !Object.keys(obj).length

export default function ({ Plugin, types: t }) {
  return new Plugin("provide-modules", {
    visitor: {
      Program: {
        exit(node, parent, scope, file){
          if (!file.opts
            || isEmptyObject(file.opts.extra)
            || isEmptyObject(file.opts.extra['provide-modules'])) {
            return;
          }
          const modulesObject = file.opts.extra['provide-modules']

          Object.keys(modulesObject).forEach(function(binding){
            let module = modulesObject[binding];
            if (!scope.hasBinding(binding)) {
              node.body.unshift(
                t.importDeclaration(
                  [ t.importDefaultSpecifier(t.identifier(binding)) ],
                  t.literal(module)
                )
              )
            }
          })
        }
      }
    }
  });
}
