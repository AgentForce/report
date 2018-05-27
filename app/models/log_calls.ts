import uniqueValidator = require('mongoose-unique-validator');
import { Schema, model } from 'mongoose';
// log_user_activities
let logCallsSchema = new Schema({
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

logCallsSchema.set('timestamps', true); // include timestamps in docs

logCallsSchema.plugin(uniqueValidator);

logCallsSchema.set('toJSON', {
    virtuals: true, // Ensure virtual fields are serialized
    transform: (doc: any, ret: any) => {
        delete ret.__v; // hide
        delete ret._id; // hide
    }
});

const logCalls = model('logCalls', logCallsSchema);
export { logCalls as logCalls };