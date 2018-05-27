"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_1 = require("../controllers/dashboard");
function routes(server) {
    const path = '/api/count';
    const version = '1.0.0';
    const dashboardCtrl = new dashboard_1.default();
    server.get({ path: `${path}/device`, version: version }, dashboardCtrl.countDevices);
    server.get({ path: `${path}/tenAgency/:numweekFrom/:numweekTo`, version: version }, dashboardCtrl.getTenAgency);
    server.get({ path: `${path}/getAgencyInWeek`, version: version }, dashboardCtrl.getAgencyInWeek);
    server.get({ path: `${path}/getUserOnboard`, version: version }, dashboardCtrl.getUserOnboard);
    server.get({ path: `${path}/getAction`, version: version }, dashboardCtrl.getActionInWeek);
    server.get({ path: `${path}/getActionCall/:numweekFrom/:numweekTo`, version: version }, dashboardCtrl.getActionCallInWeek);
    server.get({ path: `${path}/getSales/:numweekFrom/:numweekTo`, version: version }, dashboardCtrl.getSalesInWeek);
    server.get({ path: `${path}/getRecruitment/:numweekFrom/:numweekTo`, version: version }, dashboardCtrl.getRecruitmentInWeek);
    server.get({ path: `${path}/getProduct/:numweekFrom/:numweekTo`, version: version }, dashboardCtrl.getProduct);
}
exports.routes = routes;
//# sourceMappingURL=dashboard.js.map