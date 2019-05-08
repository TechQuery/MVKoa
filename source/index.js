import Koa from 'koa';

import Router from 'koa-route';

const route_map = new WeakMap();

export class KoaController extends Koa {
    constructor() {
        super();

        route_map
            .get(this.constructor)
            .forEach(([type, path, placement, method]) =>
                this.use(
                    Router[type.toLowerCase()](
                        path,
                        method.bind(
                            placement === 'static' ? this.constructor : this
                        )
                    )
                )
            );
    }
}

/**
 * @param {String} method - HTTP method or `ALL`
 * @param {String} path   - https://github.com/koajs/route#readme
 *
 * @return {Decorator}
 */
export function request(method, path) {
    return meta => {
        meta.finisher = Class => {
            const map = route_map.get(Class) || [];

            map.push([method, path, meta.placement, meta.descriptor.value]);

            route_map.set(Class, map);
        };
    };
}

export function HEAD(path) {
    return request('HEAD', path);
}

export function GET(path) {
    return request('GET', path);
}

export function POST(path) {
    return request('POST', path);
}

export function PUT(path) {
    return request('PUT', path);
}

export function PATCH(path) {
    return request('PATCH', path);
}

export function DELETE(path) {
    return request('DELETE', path);
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
