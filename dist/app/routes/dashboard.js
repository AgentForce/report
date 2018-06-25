"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_1 = require("../controllers/dashboard");
const tokenValidator_1 = require("../validators/tokenValidator");
function routes(server) {
    const path = '/api/count';
    const version = '1.0.0';
    const dashboardCtrl = new dashboard_1.default();
    const tokenValidator = new tokenValidator_1.TokenValidator();
    server.get({ path: `${path}/device`, version: version }, tokenValidator.checkToken, dashboardCtrl.countDevices);
    server.get({ path: `${path}/tenAgency/:numweekFrom/:numweekTo/:dateFrom/:dateTo`, version: version }, tokenValidator.checkToken, dashboardCtrl.getTenAgency);
    server.get({ path: `${path}/getAgencyInWeek`, version: version }, tokenValidator.checkToken, dashboardCtrl.getAgencyInWeek);
    server.get({ path: `${path}/getUserOnboard`, version: version }, tokenValidator.checkToken, dashboardCtrl.getUserOnboard);
    server.get({ path: `${path}/getAction/:dateFrom/:day`, version: version }, tokenValidator.checkToken, dashboardCtrl.getActionInWeek);
    server.get({ path: `${path}/getActionCall/:numweekFrom/:numweekTo`, version: version }, tokenValidator.checkToken, dashboardCtrl.getActionCallInWeek);
    server.get({ path: `${path}/getSales/:numweekFrom/:numweekTo`, version: version }, tokenValidator.checkToken, dashboardCtrl.getSalesInWeek);
    server.get({ path: `${path}/getRecruitment/:numweekFrom/:numweekTo`, version: version }, tokenValidator.checkToken, dashboardCtrl.getRecruitmentInWeek);
    server.get({ path: `${path}/getProduct/:numweekFrom/:numweekTo`, version: version }, tokenValidator.checkToken, dashboardCtrl.getProduct);
}
exports.routes = routes;
//# sourceMappingURL=dashboard.js.map