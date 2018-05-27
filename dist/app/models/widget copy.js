"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uniqueValidator = require("mongoose-unique-validator");
const mongoose_1 = require("mongoose");
let widgetSchema = new mongoose_1.Schema({
    product_id: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true,
        'enum': ['Red', 'Blue', 'Yellow', 'Green', 'Orange', 'Purple', 'White', 'Black']
    },
    size: {
        type: String,
        required: true,
        'enum': ['XL', 'Large', 'Medium', 'Small', 'XS']
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    inventory: {
        type: Number,
        required: true,
        min: 0
    }
});
widgetSchema.set('timestamps', true);
widgetSchema.plugin(uniqueValidator);
widgetSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret.__v;
        delete ret._id;
    }
});
const widget = mongoose_1.model('Widget', widgetSchema);
exports.Widget = widget;
//# sourceMappingURL=widget copy.js.map