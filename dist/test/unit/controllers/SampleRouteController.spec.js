"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const app_1 = require("../../../app/app");
const supertest = require("supertest");
const logger_1 = require("../../../app/services/logger");
const sinon = require("sinon");
describe('sample route controller', () => {
    const sandbox = sinon.sandbox.create();
    let logInfoStub;
    beforeEach(() => {
        logInfoStub = sandbox.stub(logger_1.logger, 'info');
    });
    afterEach(() => {
        sandbox.restore();
    });
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
                chai_1.expect(logInfoStub.callCount).to.equal(1);
                done();
                app_1.server.close();
            }
        });
    });
});
//# sourceMappingURL=SampleRouteController.spec.js.map