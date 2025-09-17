import { env } from "../config/envConfig";

export const openApiSpec = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PackPal API",
      version: "1.0.0",
      description: "API documentation for PackPal App",
    },
    servers: [
      {
        url: env.isProduction
          ? "https://packpal.app/api/v1"
          : "http://localhost:4000/api/v1",
        description: env.isProduction ? "Production server" : "Development server",
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
