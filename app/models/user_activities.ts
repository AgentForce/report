import uniqueValidator = require('mongoose-unique-validator');
import { Schema, model } from 'mongoose';
// log_user_activities

let userActivitiesSchema = new Schema({
    clientId: {
        type: String,
        required: true,
    },
    versionApp: {
        type: String,
        required: true
    },
    imei: {
        type: String,
        required: true
    },
    deviceName: {
        type: String,
        required: true
    },
    versionOs: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    activityType: {
        type: String,
        required: true,
    },
    activityName: {
        type: String,
        required: true,
    }
}, { collection: 'log_user_activities' });

userActivitiesSchema.set('timestamps', true); // include timestamps in docs

userActivitiesSchema.plugin(uniqueValidator);

userActivitiesSchema.set('toJSON', {
    virtuals: true, // Ensure virtual fields are serialized
    transform: (doc: any, ret: any) => {
        delete ret.__v; // hide
        delete ret._id; // hide
    }
});

const userActivities = model('userActivities', userActivitiesSchema);
export { userActivities as UserActivities };