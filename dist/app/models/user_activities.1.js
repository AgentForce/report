"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uniqueValidator = require("mongoose-unique-validator");
const mongoose_1 = require("mongoose");
let userActivitiesSchema = new mongoose_1.Schema({
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
userActivitiesSchema.set('timestamps', true);
userActivitiesSchema.plugin(uniqueValidator);
userActivitiesSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret.__v;
        delete ret._id;
    }
});
const userActivities = mongoose_1.model('userActivities', userActivitiesSchema);
exports.UserActivities = userActivities;
//# sourceMappingURL=user_activities.1.js.map