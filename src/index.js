export default function ({ Plugin, types: t }) {
  return new Plugin("provide-modules", {
    visitor: {
      Program: {
        exit(node, parent, scope, file){
          if (!file.opts || !file.opts.extra) {
            return;
          }
          const modulesObject = file.opts.extra['provide-modules']

          Object.keys(modulesObject).forEach(function(module){
            let binding = modulesObject[module];
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
