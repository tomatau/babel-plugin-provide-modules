# Provide Modules

A babel plugin to Automatically load modules.

Module (value) is loaded and the identifier (key) is used as free variable. The identifier is filled with the exports of the loaded module.

## Usage

```shell
npm install --save babel babel-plugin-provide-modules
```

The add plugin to .babelrc along with options inside the extra section.

```json
{
  "plugins": [
    "provide-modules"
  ],
  "extra": {
    "provide-modules": {
      "React": "react",
      "log": "npmlog"
    }
  }
}
```

The above will inject the following into every file:

```js
import log from 'npmlog';
import React from 'react';
```