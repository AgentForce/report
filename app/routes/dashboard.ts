import dashboardController from '../controllers/dashboard';
import { Server } from 'restify';
import { TokenValidator } from '../validators/tokenValidator';

export function routes(server: Server) {
    const path = '/api/count';
    const version = '1.0.0';
    const dashboardCtrl = new dashboardController();
    const tokenValidator = new TokenValidator();

    // server.get({ path: path, version: version }, widgetCtrl.findDocuments);
    server.get({ path: `${path}/device`, version: version }, tokenValidator.checkToken, dashboardCtrl.countDevices);
    server.get({ path: `${path}/tenAgency/:numweekFrom/:numweekTo/:dateFrom/:dateTo`, version: version }, tokenValidator.checkToken, dashboardCtrl.getTenAgency);
    server.get({ path: `${path}/getAgencyInWeek`, version: version }, tokenValidator.checkToken, dashboardCtrl.getAgencyInWeek);
    server.get({ path: `${path}/getUserOnboard`, version: version }, tokenValidator.checkToken, dashboardCtrl.getUserOnboard);
    server.get({ path: `${path}/getAction/:dateFrom/:day`, version: version }, tokenValidator.checkToken, dashboardCtrl.getActionInWeek);
    server.get({ path: `${path}/getActionList/:from/:to/:offset/:limit/:type`, version: version }, tokenValidator.checkToken, dashboardCtrl.getActionList);
    server.get({ path: `${path}/getActionCall/:numweekFrom/:numweekTo`, version: version }, tokenValidator.checkToken, dashboardCtrl.getActionCallInWeek);
    server.get({ path: `${path}/getSales/:numweekFrom/:numweekTo`, version: version }, tokenValidator.checkToken, dashboardCtrl.getSalesInWeek);
    server.get({ path: `${path}/getRecruitment/:numweekFrom/:numweekTo`, version: version }, tokenValidator.checkToken, dashboardCtrl.getRecruitmentInWeek);
    server.get({ path: `${path}/getProduct/:numweekFrom/:numweekTo`, version: version }, tokenValidator.checkToken, dashboardCtrl.getProduct);
    server.get({ path: `${path}/transaction/:numweek`, version: version }, tokenValidator.checkToken, dashboardCtrl.getTransaction);
}