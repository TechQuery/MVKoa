import { KoaController, GET } from '../../source';

export default class User extends KoaController {
    @GET('/')
    listAll(context) {
        context.body = [];
    }
}
