# MVKoa

Node.JS back-end framework based on [Koa 2][1] & [ECMAScript Decorator proposal][2]

[![NPM Dependency](https://david-dm.org/TechQuery/MVKoa.svg)](https://david-dm.org/TechQuery/MVKoa)
[![Build Status](https://travis-ci.com/TechQuery/MVKoa.svg?branch=master)](https://travis-ci.com/TechQuery/MVKoa)

[![NPM](https://nodei.co/npm/mvkoa.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/mvkoa/)

## Usage

### Core logic

`source/User.js`

```javascript
import { KoaController, GET } from 'mvkoa';

export default class User extends KoaController {
    @GET()
    listAll(context) {
        context.body = [];
    }
}
```

`source/index.js`

```javascript
import Koa from 'koa';
import mount from 'koa-mount';

import User from './User';

new Koa().use(mount('/users', new User())).listen();
```

### Installation

```shell
npm init

npm install \
    koa \
    koa-mount \
    mvkoa \
    @babel/polyfill \
    @babel/runtime

npm install \
    @babel/cli \
    @babel/core \
    @babel/preset-env \
    @babel/plugin-proposal-decorators \
    @babel/plugin-transform-runtime
```

### Configuration

`package.json`

```json
{
    "scripts": {
        "build": "babel source/ -d dist/ -s",
        "start": "node dist/"
    },
    "engines": {
        "node": "^7.6.0"
    },
    "babel": {
        "presets": [
            [
                "@babel/preset-env",
                {
                    "targets": {
                        "node": "7.6.0"
                    }
                }
            ]
        ],
        "plugins": [
            [
                "@babel/plugin-proposal-decorators",
                {
                    "decoratorsBeforeExport": false
                }
            ],
            "@babel/plugin-transform-runtime"
        ]
    }
}
```

### Bootstrap

```shell
npm run build

npm start
```

[1]: https://koajs.com/
[2]: https://github.com/tc39/proposal-decorators/tree/master/previous#readme
