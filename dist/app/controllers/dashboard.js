"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_activities_1 = require("../models/user_activities");
const log_calls_1 = require("../models/log_calls");
const User_1 = require("../pgoauth/User");
const db_1 = require("../pgmnl/db");
const db_2 = require("../pgoauth/db");
const promise = require("bluebird");
const currentWeekNumber = require('current-week-number');
const moment = require('moment');
class DashboardController {
    constructor() {
        this.countDevices = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const projection = {};
            const options = {};
            let arr = new Array;
            let result = { android: 0, ios: 0 };
            const android = yield user_activities_1.UserActivities.find({ 'clientId': 'sopandroid', 'activityType': 'login' }, projection, options, (err, logs) => {
                if (err) {
                    return next(err);
                }
                else {
                    return logs;
                }
            });
            const ios = yield user_activities_1.UserActivities.find({ 'clientId': 'sopios', 'activityType': 'login' }, projection, options, (err, logs) => {
                if (err) {
                    return next(err);
                }
                else {
                    return logs;
                }
            });
            result.android = android.length;
            result.ios = ios.length;
            res.send(200, result);
        });
        this.getTenAgency = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const projection = {};
            const options = {};
            let result = new Array;
            const d = new Date();
            const m = d.getMonth() + 1;
            const day = d.getDay();
            const y = d.getFullYear();
            const NumWeekFrom = currentWeekNumber(m + '/01/' + y);
            const NumWeekTo = currentWeekNumber(d);
            const idLogin = req.token.id;
            result = yield db_1.sequelize.query('select "UserName", "UserId",sum("CurrentCallSale") as "CurrentCallSale", sum("CurrentMetting") as "CurrentMetting", sum("CurrentPresentation") as "CurrentPresentation", sum("CurrentContract") as "CurrentContract"  from manulife_campaigns where "NumWeek" between ' + req.params.numweekFrom + ' and ' + req.params.numweekTo + ' and "ReportToList" ~ ' + '\'*.' + idLogin + '.*\'' + ' group by "UserId", "UserName" order by "CurrentCallSale" desc limit 10', { replacements: {}, type: db_1.sequelize.QueryTypes.SELECT }).then(projects => {
                return projects;
            });
            yield promise.map(result, function (item) {
                return new Promise(function (fulfill, reject) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const table = 'oauth_monitor_login';
                        let count_user = yield db_2.sequelizeOauth.query('select sum("count") from ' + table + ' where "date" between ' + "'" + req.params.dateFrom + "'" + ' and ' + "'" + req.params.dateTo + "'" + ' and "report_to_list"' + ' ~\'*.' + item.UserId + '.*\'' + '', { replacements: {}, type: db_2.sequelizeOauth.QueryTypes.SELECT }).then(projects => {
                            if (projects[0].sum === null)
                                projects[0].sum = 0;
                            item.countLogin = parseInt(projects[0].sum);
                            fulfill(item);
                        });
                    });
                });
            }, { concurrency: 10 }).then(function (result) {
            }).catch(function (err) {
            });
            res.send(200, result);
        });
        this.getSalesInWeek = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const projection = {};
            const options = {};
            let result = new Array;
            const d = new Date();
            const m = d.getMonth() + 1;
            const day = d.getDay();
            const y = d.getFullYear();
            const NumWeekFrom = currentWeekNumber(m + '/01/' + y);
            const NumWeekTo = currentWeekNumber();
            const idLogin = req.token.id;
            let count_user = new Object;
            let countuser = yield db_1.sequelize.query('select sum("CurrentCallSale") as CurrentCallSale, sum("SubCurrentCallSale") as SubCurrentCallSale,sum("CurrentMetting") as CurrentMetting,sum("TargetMetting") as TargetMetting,sum("SubCurrentMetting") as SubCurrentMetting, sum("TargetCallSale") as TargetCallSale,sum("SubTargetCallSale") as SubTargetCallSale, sum("SubTargetMetting") as SubTargetMetting, sum("CurrentPresentation") as CurrentPresentation, sum("SubCurrentPresentation") as SubCurrentPresentation, sum("TargetPresentation") as TargetPresentation, sum("SubTargetPresentation") as SubTargetPresentation, sum("CurrentContract") as CurrentContract, sum("SubCurrentContract") as SubCurrentContract, sum("TargetContractSale") as targetcontract,sum("SubTargetContractSale") as subtargetcontract from manulife_campaigns where "UserId" = ' + idLogin + ' and "NumWeek" between ' + req.params.numweekFrom + ' and ' + req.params.numweekTo, { replacements: {}, type: db_2.sequelizeOauth.QueryTypes.SELECT }).then(projects => {
                return projects;
            });
            if (countuser.length === 0) {
                count_user = yield db_1.sequelize.query('select sum("CurrentCallSale") as CurrentCallSale, sum("TargetCallSale") as TargetCallSale, sum("CurrentMetting") as CurrentMetting, sum("TargetMetting") as TargetMetting, sum("CurrentPresentation") as CurrentPresentation, sum("TargetPresentation") as TargetPresentation, sum("CurrentContract") as CurrentContract, sum("TargetContractSale") as TargetContract  from manulife_campaigns where "ReportToList" ~ ' + '\'*.' + idLogin + '.*\'' + ' and "NumWeek" between ' + req.params.numweekFrom + ' and ' + req.params.numweekTo, { replacements: {}, type: db_2.sequelizeOauth.QueryTypes.SELECT }).then(projects => {
                    if (projects[0].currentcallsale === null)
                        projects[0].currentcallsale = 0;
                    if (projects[0].targetcallsale === null)
                        projects[0].targetcallsale = 0;
                    if (projects[0].currentmetting === null)
                        projects[0].currentmetting = 0;
                    if (projects[0].targetmetting === null)
                        projects[0].targetmetting = 0;
                    if (projects[0].currentcontract === null)
                        projects[0].currentcontract = 0;
                    if (projects[0].currentpresentation === null)
                        projects[0].currentpresentation = 0;
                    if (projects[0].targetpresentation === null)
                        projects[0].targetpresentation = 0;
                    if (projects[0].targetcontract === null)
                        projects[0].targetcontract = 0;
                    return projects[0];
                });
            }
            else {
                count_user.currentcallsale = parseInt(countuser[0].currentcallsale) + parseInt(countuser[0].subcurrentcallsale);
                count_user.targetcallsale = parseInt(countuser[0].targetcallsale) + parseInt(countuser[0].subtargetcallsale);
                count_user.currentmetting = parseInt(countuser[0].currentmetting) + parseInt(countuser[0].subcurrentmetting);
                count_user.targetmetting = parseInt(countuser[0].targetmetting) + parseInt(countuser[0].subtargetmetting);
                count_user.currentpresentation = parseInt(countuser[0].currentcallsale) + parseInt(countuser[0].subcurrentcallsale);
                count_user.targetpresentation = parseInt(countuser[0].targetpresentation) + parseInt(countuser[0].subtargetpresentation);
                count_user.currentcontract = parseInt(countuser[0].currentcontract) + parseInt(countuser[0].subcurrentcontract);
                count_user.targetcontract = parseInt(countuser[0].currentcallsale) + parseInt(countuser[0].subtargetcontract);
                count_user.currentpresentation = parseInt(countuser[0].currentpresentation) + parseInt(countuser[0].subcurrentpresentation);
            }
            count_user.countContract = yield db_1.sequelize.query('select  count(*) from manulife_contracts where "ReportToList" ~ ' + '\'*.' + idLogin + '.*\'' + ' and "NumWeek" between ' + req.params.numweekFrom + ' and ' + req.params.numweekTo, { replacements: {}, type: db_2.sequelizeOauth.QueryTypes.SELECT }).then(projects => {
                return projects[0].count;
            });
            res.send(200, count_user);
        });
        this.getProduct = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const projection = {};
            const options = {};
            let result = new Array;
            const d = new Date();
            const m = d.getMonth() + 1;
            const day = d.getDay();
            const y = d.getFullYear();
            const NumWeekFrom = currentWeekNumber(m + '/01/' + y);
            const NumWeekTo = currentWeekNumber();
            const idLogin = req.token.id;
            let count_user = yield db_1.sequelize.query('select  "Title",  "ProductId",sum("NumContract") as NumContract, sum("Revenue") as Revenue from manulife_contract_products, manulife_products where "ProductId" = manulife_products."Id" and "NumWeek" between ' + req.params.numweekFrom + ' and ' + req.params.numweekTo + ' and "ReportToList" ' + '~\'*.' + idLogin + '.*\'' + ' group by "ProductId", "Title"', { replacements: {}, type: db_2.sequelizeOauth.QueryTypes.SELECT }).then(projects => {
                return projects;
            });
            res.send(200, count_user);
        });
        this.getRecruitmentInWeek = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const projection = {};
            const options = {};
            let result = new Array;
            const d = new Date();
            const m = d.getMonth() + 1;
            const day = d.getDay();
            const y = d.getFullYear();
            const NumWeekFrom = currentWeekNumber(m + '/01/' + y);
            const NumWeekTo = currentWeekNumber();
            const idLogin = req.token.id;
            let count_user = yield db_1.sequelize.query('select "CurrentSurvey","SubCurrentSurvey","TargetSurvey","SubTargetSurvey","CurrentCop","SubCurrentCop", "TargetCop", "SubTargetCop", "CurrentMit", "SubCurrentMit", "TargetMit", "SubTargetMit", "CurrentAgentCode", "SubCurrentAgentCode", "TargetAgentCode", "SubTargetAgentCode" from manulife_campaigns where "UserId" = ' + idLogin + ' and  "NumWeek" between ' + req.params.numweekFrom + ' and ' + req.params.numweekTo, { replacements: {}, type: db_2.sequelizeOauth.QueryTypes.SELECT }).then(projects => {
                return projects;
            });
            if (count_user.length === 0) {
                count_user = yield db_1.sequelize.query('select sum("CurrentSurvey") as CurrentSurvey, sum("TargetSurvey") as TargetSurvey, sum("CurrentCop") as CurrentCop, sum("TargetCop") as TargetCop, sum("CurrentMit") as CurrentMit, sum("TargetMit") as TargetMit, sum("CurrentAgentCode") as CurrentAgentCode, sum("TargetAgentCode") as TargetAgentCode  from manulife_campaigns where "ReportToList" ~ ' + '\'*.' + idLogin + '.*\'' + ' and "NumWeek" between ' + req.params.numweekFrom + ' and ' + req.params.numweekTo, { replacements: {}, type: db_2.sequelizeOauth.QueryTypes.SELECT }).then(projects => {
                    return projects[0];
                });
            }
            else {
                count_user = count_user[0];
                count_user.currentsurvey = count_user.currentsurvey + count_user.subcurrentsurvey;
                count_user.targetsurvey = count_user.targetsurvey + count_user.subtargetsurvey;
                count_user.currentcop = count_user.currentcop + count_user.subcurrentcop;
                count_user.targetcop = count_user.targetcop + count_user.subtargetcop;
                count_user.currentmit = count_user.currentmit + count_user.currentmit;
                count_user.targetmit = count_user.targetmit + count_user.subtargetmit;
                count_user.currentagentcode = count_user.currentagentcode + count_user.subcurrentagentcode;
                count_user.targetagentcode = count_user.targetagentcode + count_user.sutargetagentcode;
            }
            count_user.msdc = yield db_1.sequelize.query('select  count(*) from manulife_leads where "ReportToList" ~ ' + '\'*.' + idLogin + '.*\'' + ' and "NumWeek" between ' + req.params.numweekFrom + ' and ' + req.params.numweekTo, { replacements: {}, type: db_2.sequelizeOauth.QueryTypes.SELECT }).then(projects => {
                return projects[0].count;
            });
            res.send(200, count_user);
        });
        this.getTransaction = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let obj;
            let idLogin = req.token.id;
            yield promise.map([2, 3, 4, 6], function (ProcessStep) {
                return new Promise(function (fulfill, reject) {
                    return __awaiter(this, void 0, void 0, function* () {
                        let where_add = '';
                        let obj = { step: ProcessStep, min: 0, max: 0, avg: 0 };
                        if (ProcessStep === 6) {
                            where_add = ' and "StatusProcessStep" = 5 ';
                            obj = { step: 5, min: 0, max: 0, avg: 0 };
                        }
                        obj.min = yield db_1.sequelize.query('SELECT min("TimePrevious") as value FROM "manulife_leads_transactions" where "ProcessStep" = ' + ProcessStep + where_add + ' and "ChangeType" = 1 and "ReportToList"' + ' ~\'*.' + idLogin + '.*\'' + ' and "NumWeek" =' + req.params.numweek, { replacements: {}, type: db_1.sequelize.QueryTypes.SELECT }).then(projects => {
                            if (projects[0].value === null)
                                return 0;
                            else
                                return projects[0].value;
                        });
                        obj.max = yield db_1.sequelize.query('SELECT max("TimePrevious") as value FROM "manulife_leads_transactions" where "ProcessStep" = ' + ProcessStep + where_add + '  and "ChangeType" = 1 and "ReportToList"' + ' ~\'*.' + idLogin + '.*\'' + ' and "NumWeek" =' + req.params.numweek, { replacements: {}, type: db_1.sequelize.QueryTypes.SELECT }).then(projects => {
                            if (projects[0].value === null)
                                return 0;
                            else
                                return projects[0].value;
                        });
                        obj.avg = yield db_1.sequelize.query('SELECT avg("TimePrevious") as value FROM "manulife_leads_transactions" where "ProcessStep"  = ' + ProcessStep + where_add + '  and "ChangeType" = 1 and "ReportToList"' + ' ~\'*.' + idLogin + '.*\'' + ' and "NumWeek" =' + req.params.numweek, { replacements: {}, type: db_1.sequelize.QueryTypes.SELECT }).then(projects => {
                            if (projects[0].value === null)
                                return 0;
                            else
                                return projects[0].value;
                        });
                        fulfill(obj);
                    });
                });
            }, { concurrency: 10 }).then(function (result) {
                obj = result;
            }).catch(function (err) {
                console.log(err);
            });
            yield res.send(200, obj);
        });
        this.getActionInWeek = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const projection = {};
            const options = {};
            let result = new Array;
            const idLogin = req.token.id;
            let count_user = yield db_2.sequelizeOauth.query('select count(*) from oauth_users where "report_to_list"' + ' ~\'*.' + idLogin + '.*\'' + '', { replacements: {}, type: db_2.sequelizeOauth.QueryTypes.SELECT }).then(projects => {
                return projects[0].count;
            });
            count_user = parseInt(count_user);
            let arr_days;
            arr_days = new Array;
            for (let i = 0; i < req.params.day; i++) {
                arr_days[i] = moment(req.params.dateFrom).subtract(i * -1, 'days').format('YYYY-MM-DD');
            }
            if (arr_days.length === parseInt(req.params.day)) {
                let arr = new Array;
                const promise_map = { total: count_user, arr_days: arr };
                yield promise.map(arr_days, function (day) {
                    return new Promise(function (fulfill, reject) {
                        return __awaiter(this, void 0, void 0, function* () {
                            const dayf = moment(day).subtract(1, 'days').format('YYYY-MM-DD');
                            const table = 'oauth_monitor_login';
                            let count_user = yield db_2.sequelizeOauth.query('select count(*) from ' + table + ' where "date" between ' + "'" + dayf + "'" + ' and ' + "'" + day + "'" + ' and "report_to_list"' + ' ~\'*.' + idLogin + '.*\'' + '', { replacements: {}, type: db_2.sequelizeOauth.QueryTypes.SELECT }).then(projects => {
                                if (projects[0].count === null)
                                    projects[0].count = 0;
                                const obj_xl_date = { date: day, countLogin: parseInt(projects[0].count) };
                                fulfill(obj_xl_date);
                            });
                        });
                    });
                }, { concurrency: 10 }).then(function (result) {
                    promise_map.arr_days = result;
                }).catch(function (err) {
                    console.log(err);
                });
                yield res.send(200, promise_map);
            }
        });
        this.getActionList = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const projection = {};
            const options = {};
            let result = new Array;
            let idLogin = req.token.id;
            idLogin = 56;
            const table = 'oauth_monitor_login';
            const count_user = yield db_2.sequelizeOauth.query('select user_id, fullname, count(user_id) as count from ' + table + ' where "date" between ' + "'" + req.params.from + "'" + ' and ' + "'" + req.params.to + "'" + ' and "report_to_list"' + ' ~\'*.' + idLogin + '.*\'' + ' group by user_id, fullname order by count asc', { replacements: {}, type: db_2.sequelizeOauth.QueryTypes.SELECT }).then(projects => {
                return projects;
            });
            yield res.send(200, count_user);
        });
        this.getActionCallInWeek = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const projection = {};
            const options = {};
            let result = new Array;
            const d = new Date();
            const m = d.getMonth() + 1;
            const day = d.getDay();
            const y = d.getFullYear();
            const NumWeekFrom = currentWeekNumber(m + '/01/' + y);
            const NumWeekTo = currentWeekNumber(d);
            const idLogin = req.token.id;
            const arr_AgentReportTo = yield User_1.User.findAll({ where: { report_to: idLogin + '' }, offset: 1, limit: 5 });
            const date_to = moment().subtract(0, 'days').format('YYYY-MM-DD');
            const date_from = moment().subtract(6, 'days').format('YYYY-MM-DD');
            let promise_map;
            yield promise.map(arr_AgentReportTo, function (obj_agent) {
                return new Promise(function (fulfill, reject) {
                    return __awaiter(this, void 0, void 0, function* () {
                        let arr = new Array;
                        let obj = { username: obj_agent.username, call: 0, activity: 0 };
                        const call = yield log_calls_1.logCalls.find({ reportToList: { '$regex': obj_agent.id, '$options': 'i' } }, projection, options, (err, calls) => {
                            if (err) {
                                return next(err);
                            }
                            else {
                                return calls;
                            }
                        });
                        obj.call = call.length;
                        let result;
                        result = yield db_1.sequelize.query('select sum("SubCurrentMetting") as SubCurrentMetting, sum("CurrentMetting") as CurrentMetting from manulife_campaigns where "ReportTo" = ' + obj_agent.id + ' and "NumWeek" between ' + req.params.numweekFrom + ' and ' + req.params.numweekTo, { replacements: {}, type: db_1.sequelize.QueryTypes.SELECT }).then(projects => {
                            return projects;
                        });
                        if (parseInt(result[0].SubCurrentMetting) < 1) {
                            result = yield db_1.sequelize.query('select sum("CurrentMetting") as CurrentMetting from manulife_campaigns where "ReportToList" ~ ' + '\'*.' + obj_agent.id + '.*\'' + ' and "NumWeek" between ' + req.params.numweekFrom + ' and ' + req.params.numweekTo, { replacements: {}, type: db_1.sequelize.QueryTypes.SELECT }).then(projects => {
                                return projects;
                            });
                            if (parseInt(result[0].CurrentMetting) > 0)
                                obj.activity = parseInt(result[0].CurrentMetting);
                        }
                        else {
                            if (parseInt(result[0].CurrentMetting) > 0)
                                obj.activity = parseInt(result[0].SubCurrentMetting) + parseInt(result[0].CurrentMetting);
                        }
                        fulfill(obj);
                    });
                });
            }, { concurrency: 10 }).then(function (result) {
                promise_map = result;
            }).catch(function (err) {
                console.log(err);
            });
            res.send(200, promise_map);
        });
        this.getAgencyInWeek = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const projection = {};
            const options = {};
            let result = new Array;
            const d = new Date();
            const m = d.getMonth() + 1;
            const day = d.getDay();
            const y = d.getFullYear();
            const NumWeekFrom = currentWeekNumber(m + '/01/' + y);
            const NumWeekTo = currentWeekNumber(d);
            const idLogin = req.token.id;
            const arr_AgentReportTo = yield User_1.User.findAll({ where: { report_to: idLogin + '' }, offset: 1, limit: 5 });
            const arr_days = [moment().subtract(0, 'days').format('YYYY-MM-DD'), moment().subtract(1, 'days').format('YYYY-MM-DD'), moment().subtract(2, 'days').format('YYYY-MM-DD'), moment().subtract(3, 'days').format('YYYY-MM-DD'), moment().subtract(4, 'days').format('YYYY-MM-DD'),
                moment().subtract(5, 'days').format('YYYY-MM-DD'), moment().subtract(6, 'days').format('YYYY-MM-DD')];
            let promise_map;
            yield promise.map(arr_AgentReportTo, function (obj_agent) {
                return new Promise(function (fulfill, reject) {
                    return __awaiter(this, void 0, void 0, function* () {
                        let arr = new Array;
                        let obj = { username: obj_agent.username, id: obj_agent.id, arr_days: arr };
                        yield promise.map(arr_days, function (day) {
                            return new Promise(function (fulfill, reject) {
                                return __awaiter(this, void 0, void 0, function* () {
                                    const dayf = moment(day).subtract(1, 'days').format('YYYY-MM-DD');
                                    const table = 'oauth_monitor_login';
                                    let count_user = yield db_2.sequelizeOauth.query('select sum("count") from ' + table + ' where "date" between ' + "'" + dayf + "'" + ' and ' + "'" + day + "'" + ' and "report_to_list"' + ' ~\'*.' + obj_agent.id + '.*\'' + '', { replacements: {}, type: db_2.sequelizeOauth.QueryTypes.SELECT }).then(projects => {
                                        if (projects[0].sum === null)
                                            projects[0].sum = 0;
                                        const obj_xl_date = { date: day, countLogin: parseInt(projects[0].sum) };
                                        fulfill(obj_xl_date);
                                    });
                                });
                            });
                        }, { concurrency: 10 }).then(function (result) {
                            obj.arr_days = result;
                        }).catch(function (err) {
                            console.log(err);
                        });
                        fulfill(obj);
                    });
                });
            }, { concurrency: 10 }).then(function (result) {
                promise_map = result;
            }).catch(function (err) {
                console.log(err);
            });
            res.send(200, promise_map);
        });
        this.getUserOnboard = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const idLogin = req.token.id;
            const arr_AgentReportTo = yield User_1.User.findAll({ where: { report_to: idLogin + '' }, offset: 1, limit: 5 });
            let return_res;
            yield promise.map(arr_AgentReportTo, function (item) {
                return new Promise(function (fulfill, reject) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const obj = { username: item.username, fullName: item.fullName, inactive: 0, active: 0 };
                        let inactive;
                        inactive = yield db_2.sequelizeOauth.query('select count(*) from oauth_users where "report_to_list"' + ' ~\'*.' + item.id + '.*\'' + ' and "status" = 0', { replacements: {}, type: db_2.sequelizeOauth.QueryTypes.SELECT }).then(projects => {
                            return projects[0].count;
                        });
                        const active = yield db_2.sequelizeOauth.query('select count(*) from oauth_users where "report_to_list"' + ' ~\'*.' + item.id + '.*\'' + ' and "status" = 1', { replacements: {}, type: db_2.sequelizeOauth.QueryTypes.SELECT }).then(projects => {
                            return projects[0].count;
                        });
                        obj.inactive = parseInt(inactive);
                        obj.active = parseInt(active);
                        fulfill(obj);
                    });
                });
            }, { concurrency: 10 }).then(function (result) {
                return_res = result;
            }).catch(function (err) {
                console.log(err);
            });
            res.send(200, return_res);
        });
    }
}
exports.default = DashboardController;
//# sourceMappingURL=dashboard.js.map