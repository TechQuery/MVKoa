# MVKoa

Node.JS back-end framework based on [Koa 2][1] & [ECMAScript Decorator proposal][2]

[![NPM Dependency](https://david-dm.org/TechQuery/MVKoa.svg)](https://david-dm.org/TechQuery/MVKoa)
[![Build Status](https://travis-ci.com/TechQuery/MVKoa.svg?branch=master)](https://travis-ci.com/TechQuery/MVKoa)

[![NPM](https://nodei.co/npm/mvkoa.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/mvkoa/)

## Basic usage

### Core logic

[`source/UserController.js`][3]

([`source/User.js`][4] is a [`Model` class][5])

```javascript
import KoaController, { GET, PATCH, POST } from 'mvkoa';

import { User } from './User';

export default class UserController extends KoaController {
    @GET()
    listAll() {
        return [];
    }

    @PATCH('/:id')
    extend(context, id, body) {
        return { id, ...body };
    }

    @POST('/', User)
    create(context, body) {
        return body.valueOf();
    }
}
```

`source/index.js`

```javascript
import KoaController from 'mvkoa';
import bodyParser from 'koa-bodyparser';
import mount from 'koa-mount';

import UserController from './UserController';

const app = new KoaController()
    .use(async (context, next) => {
        try {
            await next();
        } catch ({ message }) {
            (context.status = 500), (context.body = message);
        }
    })
    .use(bodyParser())
    .use(mount('/users', new UserController()));

app.listen(() => console.log(`Server run at ${app.address}`));
```

### Installation

```shell
npm init

npm install \
    mvkoa \
    koa-bodyparser \
    koa-mount \
    data-scheme \
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
                    "decoratorsBeforeExport": true
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

## Advanced usage

https://tech-query.me/MVKoa/manual/

[1]: https://koajs.com/
[2]: https://github.com/tc39/proposal-decorators/tree/master/previous#readme
[3]: https://tech-query.me/MVKoa/test-file/test/source/UserController.js.html
[4]: https://tech-query.me/MVKoa/test-file/test/source/User.js.html
[5]: https://tech-query.me/DataScheme/
