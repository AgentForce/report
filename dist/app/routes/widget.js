"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const widget_1 = require("../controllers/widget");
function routes(server) {
    const path = '/api/widgets';
    const version = '1.0.0';
    const widgetCtrl = new widget_1.default();
    server.get({ path: path, version: version }, widgetCtrl.findDocuments);
    server.get({ path: `${path}/:product_id`, version: version }, widgetCtrl.findOneDocument);
    server.post({ path: path, version: version }, widgetCtrl.createDocument);
    server.put({ path: path, version: version }, widgetCtrl.updateDocument);
    server.del({ path: `${path}/:product_id`, version: version }, widgetCtrl.deleteDocument);
}
exports.routes = routes;
//# sourceMappingURL=widget.js.map