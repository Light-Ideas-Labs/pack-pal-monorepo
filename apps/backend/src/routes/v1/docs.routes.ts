import { Router } from "express";
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from "swagger-ui-express";

import { openApiSpec } from "../../docs/openapi.config";


const router: Router = Router();
const swaggerSpec = swaggerJsDoc(openApiSpec);

router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;
