"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openApiSpec = void 0;
const envConfig_1 = require("../config/envConfig");
exports.openApiSpec = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Coinlist Africa API",
            version: "1.0.0",
            description: "API documentation for Coinlist Africa",
        },
        servers: [
            {
                url: envConfig_1.env.isProduction
                    ? "https://coinlist.africa/api/v1"
                    : "http://localhost:4000/api/v1",
                description: envConfig_1.env.isProduction ? "Production server" : "Development server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: [
        './src/modules/controllers/**/*.ts', // ✅ Correct relative path
        './src/routes/**/*.ts',
    ],
};
