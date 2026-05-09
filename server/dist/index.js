"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const swagger_1 = require("./config/swagger");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// ─── Handle Preflight Requests ────────────────────────────────────────────────
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return res.status(200).json({});
    }
    next();
});
// ─── Middleware ────────────────────────────────────────────────────────────────
app.use((0, cors_1.default)({
    origin: '*',
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', (0, cors_1.default)());
app.use((0, morgan_1.default)(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// ─── Home Route ───────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '🚀 Inventory API is running!',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            docs: '/api/docs',
            auth: '/api/auth',
            products: '/api/products',
            users: '/api/users',
        }
    });
});
// ─── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});
// ─── API Docs ──────────────────────────────────────────────────────────────────
app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Inventory API Docs',
}));
// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', auth_routes_1.default);
app.use('/api/products', product_routes_1.default);
app.use('/api/users', user_routes_1.default);
// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(error_middleware_1.notFound);
app.use(error_middleware_1.errorHandler);
// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`
  ┌─────────────────────────────────────────┐
  │  🚀 Inventory API Server Running        │
  │  Port    : ${PORT}                         │
  │  Env     : ${process.env.NODE_ENV || 'development'}               │
  │  Docs    : http://localhost:${PORT}/api/docs │
  └─────────────────────────────────────────┘
  `);
});
exports.default = app;
//# sourceMappingURL=index.js.map