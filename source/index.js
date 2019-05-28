import Koa from 'koa';
import Router from 'koa-route';

import IP from 'internal-ip';

const route_map = new WeakMap(),
    address_map = new WeakMap(),
    body_type = {
        post: 1,
        put: 1,
        patch: 1
    };

export default class KoaController extends Koa {
    constructor() {
        const { constructor } = super();

        const route = route_map.get(constructor);

        if (!route) return;

        for (let [type, path, schema, placement, method] of route) {
            type = type.toLowerCase();

            this.use(
                Router[type](path, async (context, ...parameter) => {
                    var data =
                        type in body_type
                            ? context.request.body
                            : context.query;

                    data = await method.apply(
                        placement === 'static' ? constructor : this,
                        [
                            context,
                            ...parameter.slice(0, -1),
                            schema ? new schema(data) : data,
                            parameter.pop()
                        ]
                    );

                    if (data != null) context.body = data;
                })
            );
        }
    }

    /**
     * @type     {Object}
     * @property {String} family
     * @property {String} address
     */
    static get IPA() {
        const address = IP.v4.sync() || IP.v6.sync() || 'localhost';

        return {
            family: `IPv${address.includes(':') ? 6 : 4}`,
            address
        };
    }

    listen(...parameter) {
        const that = this,
            callback = parameter.splice(-1, 1)[0];

        return super.listen(...parameter, function() {
            address_map.set(
                that,
                `http://${KoaController.IPA.address}:${this.address().port}`
            );

            return callback.apply(this, arguments);
        });
    }

    /**
     * @type {?String} HTTP URL
     */
    get address() {
        return address_map.get(this);
    }
}

/**
 * @param {String}    [method='GET'] - HTTP method or `ALL`
 * @param {String}    [path='/']     - https://github.com/koajs/route#readme
 * @param {?Function} schema         - Data Schema for `query` or `body`
 *
 * @return {Decorator}
 */
export function request(method = 'GET', path = '/', schema) {
    return meta => {
        meta.finisher = Class => {
            const map = route_map.get(Class) || [];

            map.push([
                method,
                path,
                schema,
                meta.placement,
                meta.descriptor.value
            ]);

            route_map.set(Class, map);
        };
    };
}

export function HEAD(path, schema) {
    return request('HEAD', path, schema);
}

export function GET(path, schema) {
    return request('GET', path, schema);
}

export function POST(path, schema) {
    return request('POST', path, schema);
}

export function PUT(path, schema) {
    return request('PUT', path, schema);
}

export function PATCH(path, schema) {
    return request('PATCH', path, schema);
}

export function DELETE(path, schema) {
    return request('DELETE', path, schema);
}

/**
 * @typedef {Object} DecoratorDescriptor
 *
 * @property {String}                kind         - `class`, `field` or `method`
 * @property {String}                [key]        - Member name
 * @property {String}                [placement]  - `static` or `prototype`
 * @property {Object}                [descriptor] - Last parameter of `Object.defineProperty()`
 * @property {DecoratorDescriptor[]} [elements]   - Class members
 */

/**
 * @typedef {Function} Decorator
 *
 * @param {DecoratorDescriptor} meta
 *
 * @return {?DecoratorDescriptor}
 */

/**
 * @typedef {Function} Koa
 *
 * @see https://github.com/koajs/koa/blob/master/docs/api/index.md#application
 */
