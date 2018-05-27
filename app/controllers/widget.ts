import { Request, Response, Next } from 'restify';
import { Widget } from '../models/Widget';
import { User } from '../pgoauth/User';
import { Contract_Product } from '../pgmnl/User';
import WidgetInterface = require('../interfaces/widget');
import IWidget = WidgetInterface.IWidget;

export default class WidgetController {

    public findDocuments = async (req: Request, res: Response, next: Next) => {
        // http://mongoosejs.com/docs/api.html#model_Model.find
        const conditions = {};
        const projection = {};
        const options = { sort: { name: 1 } };
        let arr = new Array;
        let result = {mongo: arr, pg: arr, mnl: arr};

        result.mongo = await Widget.find(conditions, projection, options, (err, widgets) => {
            if (err) {
                return next(err);
            } else {
                return widgets;
            }
        });

        result.pg = await User.findAll({ offset: 1, limit: 5 });
        result.mnl = await Contract_Product.findAll({});

        res.header('X-Total-Count', result.mongo.length);
        res.send(200, result);
    }

    public findOneDocument = (req: Request, res: Response, next: Next) => {
        // http://mongoosejs.com/docs/api.html#model_Model.findOne
        const conditions = { 'product_id': req.params.product_id };
        const projection = {};
        const options = {};

        Widget.findOne(conditions,
            projection,
            options,
            (err, widget) => {
                if (err) {
                    return next(err);
                } else {
                    res.send(200, widget);
                    return next();
                }
            }
        );
    }

    public createDocument = (req: Request, res: Response, next: Next) => {
        // http://mongoosejs.com/docs/api.html#model_Model.create
        const newWidget = {
            product_id: req.body.product_id,
            name: req.body.name,
            color: req.body.color,
            size: req.body.size,
            price: req.body.price,
            inventory: req.body.inventory
        };

        Widget.create(newWidget,
            (err: Error) => {
                if (err) {
                    return next(err);
                } else {
                    res.send(204);
                    return next();
                }
            }
        );
    }

    public updateDocument = (req: Request, res: Response, next: Next) => {
        // http://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate
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

        Widget.findOneAndUpdate(conditions,
            update,
            options,
            (err) => {
                if (err) {
                    return next(err);
                } else {
                    res.send(204);
                    return next();
                }
            }
        );
    }

    public deleteDocument = (req: Request, res: Response, next: Next) => {
        // http://mongoosejs.com/docs/api.html#query_Query-remove
        const conditions = { product_id: req.params.product_id };

        Widget.remove(conditions,
            (err) => {
                if (err) {
                    return next(err);
                } else {
                    res.send(204);
                    return next();
                }
            }
        );
    }
}