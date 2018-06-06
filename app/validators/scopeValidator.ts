import * as Joi from 'joi';
import { JoiObject } from 'joi';
import { Router, Request, Response, NextFunction } from "express";

export class ScopeValidator {
    
    constructor() { }

    validateBody(schema) {
        return (req: Request, res: Response, next: NextFunction) => {
          
            const result = Joi.validate(req.body, schema);

            if (result.error) {
                return res.status(400).json(result.error);
            } else {
                if (!req['value']) {
                    req['value'] = {};
                }
                if (!req['value']['body']) {
                    req['value']['body'] = {};
                }
                req['value']['body'] = result.value;
                next();
            }
        }
    }


}
 

export const scopeSchema = Joi.object().keys({
    name: Joi.string().min(3).max(125).required(),
    scope: Joi.string().regex(/^[_/a-zA-Z0-9]{3,30}$/).required(),
    resource: Joi.string().regex(/^[_a-zA-Z0-9]{3,30}$/).required(),
    is_default: Joi.boolean()
});
