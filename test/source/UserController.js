import KoaController, { GET, PATCH, POST } from '../../source';

import { User } from './User';

export default class UserController extends KoaController {
    @GET()
    listAll(context) {
        context.body = [];
    }

    @PATCH('/:id')
    extend(context, id, body) {
        context.body = { id, ...body };
    }

    @POST('/', User)
    create(context, body) {
        context.body = body.valueOf();
    }
}
