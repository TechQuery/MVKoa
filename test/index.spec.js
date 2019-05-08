import User from './source';

import fetch from 'node-fetch';

const app = new User();

/**
 * @test {KoaController}
 */
describe('HTTP router', () => {
    var host;

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
     */
    it('GET request', async () => {
        const data = await (await fetch(host)).json();

        data.should.be.eql([]);
    });
});
