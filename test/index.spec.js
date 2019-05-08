import KoaController from '../source';
import bodyParser from 'koa-bodyparser';
import mount from 'koa-mount';

import UserController from './source/UserController';

import fetch from 'node-fetch';

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

/**
 * @test {KoaController}
 */
describe('HTTP router', () => {
    var host;

    function request(path, method, body) {
        return fetch(host + path, {
            method,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body
        });
    }

    /**
     * @test {KoaController.getIPA}
     * @test {KoaController#listen}
     */
    it('Boot server', done =>
        app.listen(() => {
            host = app.address;

            host.should.be.match(/^http:\/\/\S+:\d+$/);

            done();
        }));

    /**
     * @test {request}
     * @test {KoaController#constructor}
     */
    it('GET request', async () => {
        const data = await (await request('/users')).json();

        data.should.be.eql([]);
    });

    /**
     * @test {request}
     * @test {KoaController#constructor}
     */
    it('PATCH request', async () => {
        const data = await (await request(
            '/users/1',
            'PATCH',
            'a=1&b=2'
        )).json();

        data.should.be.eql({ id: '1', a: '1', b: '2' });
    });

    /**
     * @test {request}
     * @test {KoaController#constructor}
     */
    describe('POST request', () => {
        it('passes Schema validation', async () => {
            const data = await (await request(
                '/users',
                'POST',
                'name=test&email=test@example.com'
            )).json();

            data.should.be.eql({
                name: 'test',
                email: 'test@example.com',
                gender: 2,
                avatar: 'http://example.com/test.jpg'
            });
        });

        it('fails Schema validation', async () => {
            const response = await request('/users', 'POST', 'name=test');

            response.status.should.be.equal(500);

            (await response.text()).should.be.equal(
                '"email" of User should match /^.+?@(.+?\\.){1,}\\w+$/'
            );
        });
    });
});
