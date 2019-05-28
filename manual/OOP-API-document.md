# OOP API document

## Installation

```shell
npm install -D \
    eslint \
    babel-eslint \
    esdoc \
    esdoc-standard-plugin \
    esdoc-ecmascript-proposal-plugin \
    esdoc-external-nodejs-plugin
```

## Configuration

`.esdoc.json`

```json
{
    "source": "./source",
    "destination": "./docs",
    "plugins": [
        {
            "name": "esdoc-standard-plugin",
            "option": {
                "accessor": {
                    "access": ["public", "protected"],
                    "autoPrivate": false
                }
            }
        },
        {
            "name": "esdoc-ecmascript-proposal-plugin",
            "option": {
                "all": true
            }
        },
        {
            "name": "esdoc-external-nodejs-plugin",
            "option": {
                "enable": true
            }
        }
    ]
}
```

`.eslintrc.json`

```json
{
    "env": {
        "es6": true,
        "node": true
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 9,
        "sourceType": "module",
        "ecmaFeatures": {
            "legacyDecorators": true
        }
    },
    "extends": "eslint:recommended",
    "rules": {
        "valid-jsdoc": [
            "error",
            {
                "prefer": {
                    "returns": "return"
                },
                "requireParamDescription": false,
                "requireReturn": false,
                "requireReturnDescription": false
            }
        ]
    }
}
```

`package.json`

```json
{
    "scripts": {
        "lint": "eslint source/ --fix",
        "docs": "npm run lint  &&  esdoc"
    }
}
```

## Generating

```shell
npm run docs
```
