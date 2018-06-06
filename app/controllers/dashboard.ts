import { Request, Response, Next } from 'restify';
import { UserActivities } from '../models/user_activities';
import { logCalls } from '../models/log_calls';
import { User } from '../pgoauth/User';
import { Contract_Product } from '../pgmnl/User';
import WidgetInterface = require('../interfaces/widget');
import IWidget = WidgetInterface.IWidget;
import { sequelize } from '../pgmnl/db';
import { sequelizeOauth } from '../pgoauth/db';

// import Promise = require('bluebird');
import promise = require('bluebird');
import { CANCELLED } from 'dns';
import { constants } from 'zlib';
const currentWeekNumber = require('current-week-number');
const moment = require('moment');

export default class DashboardController {

    public countDevices = async (req: Request, res: Response, next: Next) => {
        // http://mongoosejs.com/docs/api.html#model_Model.find
        const projection = {};
        const options = { };
        let arr = new Array;
        let result = {android: 0, ios: 0};

        const android = await UserActivities.find({'clientId' : 'sopandroid', 'activityType': 'login'}, projection, options, (err, logs) => {
            if (err) {
                return next(err);
            } else {
                return logs;
            }
        });
        const ios = await UserActivities.find({'clientId' : 'sopios', 'activityType': 'login'}, projection, options, (err, logs) => {
            if (err) {
                return next(err);
            } else {
                return logs;
            }
        });

        result.android = android.length;
        result.ios = ios.length;
        // res.header('X-Total-Count', result.mongo.length);
        res.send(200, result);
    }

    public getTenAgency = async (req: any, res: Response, next: Next) => {
        // console.log('====');
        // console.log(req.token);
        // console.log(req.token.id);
        // http://mongoosejs.com/docs/api.html#model_Model.find
        const projection = {};
        const options = { };
        let result = new Array;
        // NumWeek
        const d = new Date();
        const m = d.getMonth() + 1;
        const day = d.getDay();
        const y = d.getFullYear();

        const NumWeekFrom = currentWeekNumber( m + '/01/' + y);
        const NumWeekTo = currentWeekNumber(d);
        // Get id user to Token
        const idLogin = req.token.id;
        result = await sequelize.query('select "UserName", "UserId",sum("CurrentCallSale") as "CurrentCallSale", sum("CurrentMetting") as "CurrentMetting", sum("CurrentPresentation") as "CurrentPresentation", sum("CurrentContract") as "CurrentContract"  from manulife_campaigns where "NumWeek" between ' + req.params.numweekFrom  + ' and ' + req.params.numweekTo + ' and "ReportToList" ~ ' + '\'*.' + idLogin + '.*\'' + ' group by "UserId", "UserName" order by "CurrentCallSale" desc limit 10',
                { replacements: { }, type: sequelize.QueryTypes.SELECT }
                ).then(projects => {
                    return projects;
                });
        await promise.map(result, function(item) {
            return new Promise(async function(fulfill, reject) {
                // Select DB oauth
                // console.log(item);
                const table = 'oauth_monitor_login'; // + (parseInt(item.UserId) % 9); report_to_list
                let count_user = await sequelizeOauth.query('select sum("count") from ' + table + ' where "date" between ' + "'" + req.params.dateFrom + "'" + ' and ' + "'" + req.params.dateTo + "'" + ' and "report_to_list"' + ' ~\'*.' + item.UserId + '.*\'' + '',
                { replacements: { }, type: sequelizeOauth.QueryTypes.SELECT }
                ).then(projects => {
                    console.log(projects);
                    if (projects[0].sum === null) projects[0].sum = 0;
                    item.countLogin = parseInt(projects[0].sum);
                    console.log(item);
                    fulfill(item);
                });
                // const arr_AgentReportTo = User.findAll({ where: {report_to: idLogin + ''}, offset: 1, limit: 5 });
                // item.countLogin = count_user; // Math.floor(Math.random() * Math.floor(99));
                // fulfill(item);
            });
          }, {concurrency: 10}).then(function(result) {
              // console.log(result);
          }).catch(function(err) {
              // console.log(err);
          });
        // res.header('X-Total-Count', result.mongo.length);
        res.send(200, result);
    }

    public getSalesInWeek = async (req: any, res: Response, next: Next) => {
        // http://mongoosejs.com/docs/api.html#model_Model.find
        const projection = {};
        const options = { };
        let result = new Array;
        // NumWeek
        const d = new Date();
        const m = d.getMonth() + 1;
        const day = d.getDay();
        const y = d.getFullYear();

        const NumWeekFrom = currentWeekNumber( m + '/01/' + y);
        const NumWeekTo = currentWeekNumber();
        // Get id user to Token
        const idLogin = req.token.id;
        // Get agent report to
        let count_user = await sequelize.query('select "CurrentCallSale","SubCurrentCallSale","CurrentMetting","TargetMetting","SubCurrentMetting", "SubTargetMetting", "CurrentPresentation","SubCurrentPresentation", "TargetPresentation","SubTargetPresentation","CurrentContract","SubCurrentContract", "TargetContract","SubTargetContract" from manulife_campaigns where "UserId" = ' + idLogin + ' and "NumWeek" between ' + req.params.numweekFrom + ' and ' + req.params.numweekTo,
        { replacements: { }, type: sequelizeOauth.QueryTypes.SELECT }
        ).then(projects => {
            return projects;
        });
        if (count_user.length === 0 ) {
            count_user = await sequelize.query('select sum("CurrentCallSale") as CurrentCallSale, sum("TargetCallSale") as TargetCallSale, sum("CurrentMetting") as CurrentMetting, sum("TargetMetting") as TargetMetting, sum("CurrentPresentation") as CurrentPresentation, sum("TargetPresentation") as TargetPresentation, sum("CurrentContract") as CurrentContract, sum("TargetContractSale") as TargetContract  from manulife_campaigns where "ReportToList" ~ ' + '\'*.' + idLogin + '.*\'' + ' and "NumWeek" between ' + req.params.numweekFrom + ' and ' + req.params.numweekTo,
            { replacements: { }, type: sequelizeOauth.QueryTypes.SELECT }
            ).then(projects => {
                return projects[0];
            });
        } else {
            count_user = count_user[0];
            count_user.currentcallsale = count_user.currentcallsale + count_user.subcurrentcallsale;
            count_user.targetcallsale = count_user.targetcallsale + count_user.subtargetcallsale;
            count_user.currentmetting = count_user.currentmetting + count_user.subcurrentmetting;
            count_user.targetmetting = count_user.targetmetting + count_user.subtargetmetting;
            count_user.currentpresentation = count_user.currentpresentation + count_user.subcurrentpresentation;
            count_user.targetpresentation = count_user.targetpresentation + count_user.subtargetpresentation;

            count_user.currentcontract = count_user.currentcontract + count_user.subcurrentcontract;
            count_user.targetcontract = count_user.targetcontract + count_user.subtargetcontract;

        }
        res.send(200, count_user);
    }

    public getProduct = async (req: any, res: Response, next: Next) => {
        // http://mongoosejs.com/docs/api.html#model_Model.find
        const projection = {};
        const options = { };
        let result = new Array;
        // NumWeek
        const d = new Date();
        const m = d.getMonth() + 1;
        const day = d.getDay();
        const y = d.getFullYear();

        const NumWeekFrom = currentWeekNumber( m + '/01/' + y);
        const NumWeekTo = currentWeekNumber();
        // Get id user to Token
        const idLogin = req.token.id;
        // Get agent report to
        let count_user = await sequelize.query('select  "Title",  "ProductId",sum("NumContract") as NumContract, sum("Revenue") as Revenue from manulife_contract_products, manulife_products where "ProductId" = manulife_products."Id" and "NumWeek" between ' + req.params.numweekFrom + ' and ' + req.params.numweekTo + ' and "ReportToList" ' + '~\'*.' + idLogin + '.*\'' + ' group by "ProductId", "Title"',
        { replacements: { }, type: sequelizeOauth.QueryTypes.SELECT }
        ).then(projects => {
            return projects;
        });
        res.send(200, count_user);
    }

    public getRecruitmentInWeek = async (req: any, res: Response, next: Next) => {
        // http://mongoosejs.com/docs/api.html#model_Model.find
        const projection = {};
        const options = { };
        let result = new Array;
        // NumWeek
        const d = new Date();
        const m = d.getMonth() + 1;
        const day = d.getDay();
        const y = d.getFullYear();

        const NumWeekFrom = currentWeekNumber( m + '/01/' + y);
        const NumWeekTo = currentWeekNumber();
        // Get id user to Token
        const idLogin = req.token.id;
        // Get agent report to
        let count_user = await sequelize.query('select "CurrentSurvey","SubCurrentSurvey","TargetSurvey","SubTargetSurvey","CurrentCop","SubCurrentCop", "TargetCop", "SubTargetCop", "CurrentMit", "SubCurrentMit", "TargetMit", "SubTargetMit", "CurrentAgentCode", "SubCurrentAgentCode", "TargetAgentCode", "SubTargetAgentCode" from manulife_campaigns where "UserId" = ' + idLogin + ' and  "NumWeek" between ' + req.params.numweekFrom + ' and ' + req.params.numweekTo,
        { replacements: { }, type: sequelizeOauth.QueryTypes.SELECT }
        ).then(projects => {
            return projects;
        });
        if (count_user.length === 0 ) {
            count_user = await sequelize.query('select sum("CurrentSurvey") as CurrentSurvey, sum("TargetSurvey") as TargetSurvey, sum("CurrentCop") as CurrentCop, sum("TargetCop") as TargetCop, sum("CurrentMit") as CurrentMit, sum("TargetMit") as TargetMit, sum("CurrentAgentCode") as CurrentAgentCode, sum("TargetAgentCode") as TargetAgentCode  from manulife_campaigns where "ReportToList" ~ ' + '\'*.' + idLogin + '.*\'' + ' and "NumWeek" between ' + req.params.numweekFrom + ' and ' + req.params.numweekTo,
            { replacements: { }, type: sequelizeOauth.QueryTypes.SELECT }
            ).then(projects => {
                return projects[0];
            });
        } else {
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
        console.log('================');
        res.send(200, count_user);
    }

    public getActionInWeek = async (req: any, res: Response, next: Next) => {
        // http://mongoosejs.com/docs/api.html#model_Model.find
        const projection = {};
        const options = { };
        let result = new Array;
        // NumWeek
        const d = new Date();
        const m = d.getMonth() + 1;
        const day = d.getDay();
        const y = d.getFullYear();

        const NumWeekFrom = currentWeekNumber( m + '/01/' + y);
        const NumWeekTo = currentWeekNumber(d);
        // Get id user to Token
        const idLogin = req.token.id;
        // Get agent report to
        let count_user = await sequelizeOauth.query('select count(*) from oauth_users where "report_to_list"' + ' ~\'*.' + idLogin + '.*\'' + '',
        { replacements: { }, type: sequelizeOauth.QueryTypes.SELECT }
        ).then(projects => {
            return projects[0].count;
        });
        count_user = parseInt(count_user);
        // Arr 7 day
        const arr_days = [moment().subtract(0, 'days').format('YYYY-MM-DD'), moment().subtract(1, 'days').format('YYYY-MM-DD'), moment().subtract(2, 'days').format('YYYY-MM-DD'), moment().subtract(3, 'days').format('YYYY-MM-DD'), moment().subtract(4, 'days').format('YYYY-MM-DD')
                            , moment().subtract(5, 'days').format('YYYY-MM-DD'), moment().subtract(6, 'days').format('YYYY-MM-DD')];
        let arr = new Array;
        const promise_map = {total : count_user, arr_days: arr};
        await promise.map(arr_days, function(day) {
            return new Promise(async function(fulfill, reject) {
                // Xử lý lại số liệu
                const dayf = moment(day).subtract(1, 'days').format('YYYY-MM-DD');
                const table = 'oauth_monitor_login'; // + (parseInt(item.UserId) % 9); report_to_list
                let count_user = await sequelizeOauth.query('select count(*) from ' + table + ' where "date" between ' + "'" + dayf + "'" + ' and ' + "'" + day + "'" + ' and "report_to_list"' + ' ~\'*.' + idLogin + '.*\'' + '',
                { replacements: { }, type: sequelizeOauth.QueryTypes.SELECT }
                ).then(projects => {
                    // console.log(projects);
                    if (projects[0].count === null) projects[0].count = 0;
                    const obj_xl_date = {date: day, countLogin : parseInt(projects[0].count) };
                    fulfill(obj_xl_date);
                });
            });
        }, {concurrency: 10}).then(function(result) {
            // console.log(result);
            promise_map.arr_days = result;
        }).catch(function(err) {
            console.log(err);
        });
        // console.log(promise_map);
        // res.header('X-Total-Count', result.mongo.length);
        res.send(200, promise_map);
    }

    public getActionCallInWeek = async (req: any, res: Response, next: Next) => {
        // http://mongoosejs.com/docs/api.html#model_Model.find
        const projection = {};
        const options = { };
        let result = new Array;
        // NumWeek
        const d = new Date();
        const m = d.getMonth() + 1;
        const day = d.getDay();
        const y = d.getFullYear();

        const NumWeekFrom = currentWeekNumber( m + '/01/' + y);
        const NumWeekTo = currentWeekNumber(d);
        // Get id user to Token
        const idLogin = req.token.id;
        // Get agent report to
        const arr_AgentReportTo = await User.findAll({ where: {report_to: idLogin + ''}, offset: 1, limit: 5 });
        // Arr 7 day
        const date_to = moment().subtract(0, 'days').format('YYYY-MM-DD');
        const date_from = moment().subtract(6, 'days').format('YYYY-MM-DD');

        let promise_map: any;
        await promise.map(arr_AgentReportTo, function(obj_agent: any) {
            return new Promise(async function(fulfill, reject) {
                let arr = new Array;
                let obj = {username : obj_agent.username, call: 0, activity: 0};
                // Xử lý call > db.restaurants.find( { borough: /Manhattan/ } ).count()
                const call = await logCalls.find({ reportToList: {'$regex': obj_agent.id, '$options': 'i'} }, projection, options, (err, calls) => {
                    if (err) {
                        return next(err);
                    } else {
                        return calls;
                    }
                });
                obj.call = call.length;
                // Activity TH1: select sum("SubCurrentMetting"),sum("CurrentMetting") from manulife_campaigns where "ReportTo" = 56 and "NumWeek" between 17 and 20
                let result: any;
                result = await sequelize.query('select sum("SubCurrentMetting") as SubCurrentMetting, sum("CurrentMetting") as CurrentMetting from manulife_campaigns where "ReportTo" = ' + obj_agent.id + ' and "NumWeek" between ' + req.params.numweekFrom + ' and ' + req.params.numweekTo,
                { replacements: { }, type: sequelize.QueryTypes.SELECT }
                ).then(projects => {
                    return projects;
                });
                // result[0].CurrentMetting = parseInt(result[0].SubCurrentMetting) + parseInt(result[0].CurrentMetting);
                if (parseInt(result[0].SubCurrentMetting) < 1) {
                    result = await sequelize.query('select sum("CurrentMetting") as CurrentMetting from manulife_campaigns where "ReportToList" ~ ' + '\'*.' + obj_agent.id + '.*\'' + ' and "NumWeek" between ' + req.params.numweekFrom + ' and ' + req.params.numweekTo,
                    { replacements: { }, type: sequelize.QueryTypes.SELECT }
                    ).then(projects => {
                        return projects;
                    });
                    if  (parseInt(result[0].CurrentMetting) > 0)
                        obj.activity = parseInt(result[0].CurrentMetting);
                } else {
                    if  (parseInt(result[0].CurrentMetting) > 0)
                        obj.activity = parseInt(result[0].SubCurrentMetting) + parseInt(result[0].CurrentMetting);
                }
                fulfill(obj);
            });
          }, {concurrency: 10}).then(function(result) {
              // console.log(result);
              promise_map = result;
          }).catch(function(err) {
              console.log(err);
          });
        console.log(promise_map);
        // res.header('X-Total-Count', result.mongo.length);
        res.send(200, promise_map);
    }

    public getAgencyInWeek = async (req: any, res: Response, next: Next) => {
        // http://mongoosejs.com/docs/api.html#model_Model.find
        const projection = {};
        const options = { };
        let result = new Array;
        // NumWeek
        const d = new Date();
        const m = d.getMonth() + 1;
        const day = d.getDay();
        const y = d.getFullYear();

        const NumWeekFrom = currentWeekNumber( m + '/01/' + y);
        const NumWeekTo = currentWeekNumber(d);
        // Get id user to Token
        const idLogin = req.token.id;
        // Get agent report to
        const arr_AgentReportTo = await User.findAll({ where: {report_to: idLogin + ''}, offset: 1, limit: 5 });
        // Arr 7 day
        const arr_days = [moment().subtract(0, 'days').format('YYYY-MM-DD'), moment().subtract(1, 'days').format('YYYY-MM-DD'), moment().subtract(2, 'days').format('YYYY-MM-DD'), moment().subtract(3, 'days').format('YYYY-MM-DD'), moment().subtract(4, 'days').format('YYYY-MM-DD')
                            , moment().subtract(5, 'days').format('YYYY-MM-DD'), moment().subtract(6, 'days').format('YYYY-MM-DD')];
        let promise_map: any;
        await promise.map(arr_AgentReportTo, function(obj_agent: any) {
            return new Promise(async function(fulfill, reject) {
                let arr = new Array;
                let obj = {username : obj_agent.username, id : obj_agent.id, arr_days: arr};
                // obj.username = 'obj_agent.username';
                await promise.map(arr_days, function(day) {
                    return new Promise(async function(fulfill, reject) {
                        // Xử lý lại số liệu
                        const dayf = moment(day).subtract(1, 'days').format('YYYY-MM-DD');
                        const table = 'oauth_monitor_login'; // + (parseInt(item.UserId) % 9); report_to_list
                        let count_user = await sequelizeOauth.query('select sum("count") from ' + table + ' where "date" between ' + "'" + dayf + "'" + ' and ' + "'" + day + "'" + ' and "report_to_list"' + ' ~\'*.' + obj_agent.id + '.*\'' + '',
                        { replacements: { }, type: sequelizeOauth.QueryTypes.SELECT }
                        ).then(projects => {
                            console.log(projects);
                            if (projects[0].sum === null) projects[0].sum = 0;
                            const obj_xl_date = {date: day, countLogin : parseInt(projects[0].sum) };
                            fulfill(obj_xl_date);
                        });
                    });
                }, {concurrency: 10}).then(function(result) {
                    console.log(result);
                    obj.arr_days = result;
                }).catch(function(err) {
                    console.log(err);
                });
                fulfill(obj);
            });
          }, {concurrency: 10}).then(function(result) {
              // console.log(result);
              promise_map = result;
          }).catch(function(err) {
              console.log(err);
          });
        // console.log(promise_map);
        // res.header('X-Total-Count', result.mongo.length);
        res.send(200, promise_map);
    }

    public getUserOnboard = async (req: any, res: Response, next: Next) => {
        // http://mongoosejs.com/docs/api.html#model_Model.find
        // Get id user to Token
        const idLogin = req.token.id;
        // Get agent report to
        const arr_AgentReportTo = await User.findAll({ where: {report_to: idLogin + ''}, offset: 1, limit: 5 });
        let return_res: any;
        await promise.map(arr_AgentReportTo, function(item: any) {
            return new Promise(async function(fulfill, reject) {
                // Select DB oauth
                const obj = {username : item.username, fullName : item.fullName, inactive: 0, active: 0};
                let inactive: any;
                inactive  = await sequelizeOauth.query('select count(*) from oauth_users where "report_to_list"' + ' ~\'*.' + item.id + '.*\'' + ' and "status" = 0',
                { replacements: { }, type: sequelizeOauth.QueryTypes.SELECT }
                ).then(projects => {
                    return projects[0].count;
                });
                const active = await sequelizeOauth.query('select count(*) from oauth_users where "report_to_list"' + ' ~\'*.' + item.id + '.*\'' + ' and "status" = 1',
                { replacements: { }, type: sequelizeOauth.QueryTypes.SELECT }
                ).then(projects => {
                    // console.log(projects);
                    return projects[0].count;
                });
                // console.log(inactive);
                obj.inactive = parseInt(inactive);
                obj.active = parseInt(active);
                fulfill(obj);
            });
        }, {concurrency: 10}).then(function(result) {
            return_res = result;
        }).catch(function(err) {
            console.log(err);
        });
        // select count(*) from oauth_users where "report_to_list" ~'*.57.*' and "status" = 0

        // select count(*) from oauth_users where "report_to_list" ~'*.57.*' and "status" = 1
        // res.header('X-Total-Count', result.mongo.length);
        res.send(200, return_res);
    }
}