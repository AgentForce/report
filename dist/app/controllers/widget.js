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
const Widget_1 = require("../models/Widget");
const User_1 = require("../pgoauth/User");
const User_2 = require("../pgmnl/User");
class WidgetController {
    constructor() {
        this.findDocuments = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const conditions = {};
            const projection = {};
            const options = { sort: { name: 1 } };
            let arr = new Array;
            let result = { mongo: arr, pg: arr, mnl: arr };
            result.mongo = yield Widget_1.Widget.find(conditions, projection, options, (err, widgets) => {
                if (err) {
                    return next(err);
                }
                else {
                    return widgets;
                }
            });
            result.pg = yield User_1.User.findAll({ offset: 1, limit: 5 });
            result.mnl = yield User_2.Contract_Product.findAll({});
            res.header('X-Total-Count', result.mongo.length);
            res.send(200, result);
        });
        this.findOneDocument = (req, res, next) => {
            const conditions = { 'product_id': req.params.product_id };
            const projection = {};
            const options = {};
            Widget_1.Widget.findOne(conditions, projection, options, (err, widget) => {
                if (err) {
                    return next(err);
                }
                else {
                    res.send(200, widget);
                    return next();
                }
            });
        };
        this.createDocument = (req, res, next) => {
            const newWidget = {
                product_id: req.body.product_id,
                name: req.body.name,
                color: req.body.color,
                size: req.body.size,
                price: req.body.price,
                inventory: req.body.inventory
            };
            Widget_1.Widget.create(newWidget, (err) => {
                if (err) {
                    return next(err);
                }
                else {
                    res.send(204);
                    return next();
                }
            });
        };
        this.updateDocument = (req, res, next) => {
            const conditions = { product_id: req.params.product_id };
            const update = {
                product_id: req.body.product_id,
                name: req.body.name,
                color: req.body.color,
                size: req.body.size,
                price: req.body.price,
                inventory: req.body.inventory
            };
            const options = { runValidators: true, context: 'query' };
            Widget_1.Widget.findOneAndUpdate(conditions, update, options, (err) => {
                if (err) {
                    return next(err);
                }
                else {
                    res.send(204);
                    return next();
                }
            });
        };
        this.deleteDocument = (req, res, next) => {
            const conditions = { product_id: req.params.product_id };
            Widget_1.Widget.remove(conditions, (err) => {
                if (err) {
                    return next(err);
                }
                else {
                    res.send(204);
                    return next();
                }
            });
        };
    }
}
exports.default = WidgetController;
//# sourceMappingURL=widget.js.map