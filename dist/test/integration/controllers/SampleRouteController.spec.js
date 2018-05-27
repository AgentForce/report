"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const app_1 = require("../../../app/app");
const supertest = require("supertest");
describe('sample route controller', () => {
    it('should return 200', (done) => {
        supertest(app_1.server)
            .get('/api/widgets')
            .end((err, response) => {
            if (err) {
                done(err);
                app_1.server.close();
            }
            else {
                chai_1.expect(response.status).to.equal(200);
                chai_1.expect(response.body).to.equal('[]');
                done();
                app_1.server.close();
            }
        });
    });
});
//# sourceMappingURL=SampleRouteController.spec.js.map