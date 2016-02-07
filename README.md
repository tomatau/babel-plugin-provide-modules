# Provide Modules

A babel plugin to Automatically load modules.

Module (value) is loaded and the identifier (key) is used as free variable. The identifier is filled with the exports of the loaded module.

## Usage

```shell
npm install --save babel babel-plugin-provide-modules
```

The add plugin to .babelrc along with options.

```js
{
  "plugins": [
    ["provide-modules", {
      "debug": "debug", // default
      "lodash": ["get", "assign"], // de-structured
      "react-dom": [{"findDOMNode" : "find"}], // de-structured with alias
      // both default and de-structured imports with alias
      "react": {
        default: "React",
        destructured: ["PropTypes", {"cloneElement": "clone" }],
      }
    }]
  ]
}
```

The above will inject the following into every file:

```js
import debug from 'debug';
import {get, assign} from 'lodash';
import {findDOMNode as find} from 'react-dom';
import React, {PropTypes, cloneElement as clone} from 'react';
```

If any file already contains a binding defined in options, the binding will not be inserted.

For example, given the same options above and the following file:

```js
const debug = 'some value';
```

Debug will not be automatically loaded for that file.