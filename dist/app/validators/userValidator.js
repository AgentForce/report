"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
class UserValidator {
    constructor() { }
    validateBody(schema) {
        return (req, res, next) => {
            const result = Joi.validate(req.body, schema);
            if (result.error) {
                return res.status(400).json(result.error);
            }
            else {
                if (!req['value']) {
                    req['value'] = {};
                }
                if (!req['value']['body']) {
                    req['value']['body'] = {};
                }
                req['value']['body'] = result.value;
                next();
            }
        };
    }
}
exports.UserValidator = UserValidator;
exports.userSchema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    phone: Joi.string().trim().required(),
    address: Joi.string().trim(),
    report_to: Joi.string().trim(),
    city: Joi.number().integer(),
    district: Joi.number().integer(),
    gender: Joi.number().integer(),
    level: Joi.number().integer(),
    status: Joi.number().integer(),
    zone: Joi.number().integer(),
    expirence: Joi.string().trim(),
    fullName: Joi.string().trim().required(),
    email: Joi.string().email().trim(),
    scope: Joi.string().trim().required(),
    resource_ids: Joi.string().required(),
    code_level: Joi.string().trim(),
    badge: Joi.string().trim(),
    birthday: Joi.date(),
    lastlogin: Joi.date(),
    createdAt: Joi.date(),
    updatedAt: Joi.date()
});
exports.userPhoneSchema = Joi.object().keys({
    phone: Joi.string().regex(/^[0-9]{9,15}$/),
    createdAt: Joi.date(),
    updatedAt: Joi.date()
});
//# sourceMappingURL=userValidator.js.map