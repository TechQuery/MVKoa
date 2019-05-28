import KoaController, { GET, PATCH, POST } from '../../source';

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
