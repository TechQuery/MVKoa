import Koa from 'koa';
import Router from 'koa-route';

import IP from 'internal-ip';

const route_map = new WeakMap(),
    address_map = new WeakMap();

export default class KoaController extends Koa {
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

    /**
     * @return   {Object}
     * @property {String} family
     * @property {String} address
     */
    static getIPA() {
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
                `http://${KoaController.getIPA().address}:${
                    this.address().port
                }`
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
