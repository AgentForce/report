"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uniqueValidator = require("mongoose-unique-validator");
const mongoose_1 = require("mongoose");
let logCallsSchema = new mongoose_1.Schema({
    leadId: {
        type: Number,
        required: true,
    },
    leadType: {
        type: Number,
        required: true
    },
    campId: {
        type: Number,
        required: true
    },
    period: {
        type: Number,
        required: true
    },
    phone: {
        type: String,
        required: true,
    },
    processStep: {
        type: Number,
        required: true,
    },
    statusProcessStep: {
        type: Number,
        required: true,
    },
    reportTo: {
        type: Number,
        required: true,
    },
    reportToList: {
        type: String,
        required: true
    },
    campInfoId: {
        type: Number,
        required: true
    }
}, { collection: 'log_calls' });
logCallsSchema.set('timestamps', true);
logCallsSchema.plugin(uniqueValidator);
logCallsSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret.__v;
        delete ret._id;
    }
});
const logCalls = mongoose_1.model('logCalls', logCallsSchema);
exports.logCalls = logCalls;
//# sourceMappingURL=log_calls.js.map