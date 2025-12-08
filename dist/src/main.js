"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
let cachedServer;
async function createServer() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
    }));
    await app.init();
    return app.getHttpAdapter().getInstance();
}
async function handler(req, res) {
    if (!cachedServer) {
        cachedServer = await createServer();
    }
    return cachedServer(req, res);
}
//# sourceMappingURL=main.js.map