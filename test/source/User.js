// https://tech-query.me/DataScheme/test-file/test/source/User.js.html

import Model, { mapGetter, is, Range, Email, Phone, URI } from 'data-scheme';

@mapGetter
export class User extends Model {
    @is(/^[\w-]{3,20}$/, '')
    set name(value) {
        this.set('name', value);
    }

    @is(Email, '')
    set email(value) {
        this.set('email', value);
    }

    @is(Phone)
    set phone(value) {
        this.set('phone', value);
    }

    @is([0, 1, 2], 2)
    set gender(value) {
        this.set('gender', value);
    }

    @is(Range(1900))
    set birthYear(value) {
        this.set('birthYear', value);
    }

    @is(URI, 'http://example.com/test.jpg')
    set avatar(value) {
        this.set('avatar', value);
    }

    @is(URI)
    set URL(value) {
        this.set('URL', value);
    }

    @is(String)
    set description(value) {
        this.set('description', value);
    }
}
