import User from './source';

import fetch from 'node-fetch';

const app = new User();
/**
 * @test {KoaController}
 */
describe('HTTP router', () => {
    before(done => app.listen(3000, done));
    /**
     * @test {request}
     */
    it('GET request', async () => {
        const data = await (await fetch('http://localhost:3000/')).json();

        data.should.be.eql([]);
    });
});
