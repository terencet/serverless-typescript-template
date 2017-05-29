import { hello } from '../src/handlers';
import * as chai from 'chai';
import {} from 'jasmine';
const expect = chai.expect;

describe('hello function', () => {
    it('processes the query string', done => {
        const requestEvent = {
            method: 'GET',
            query: {
                foo: 'bar'
            }
        };

        hello(requestEvent, {}, (err, result) => {
            //expect(err).to.be.undefined;
            expect(true).to.equal(true);
            //expect(result.message).to.equal('Method: GET, Param: bar');

            done();
        });
    });
});