import swaggerJSDoc from "swagger-jsdoc";

import dotenv from "dotenv";

dotenv.config();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Transaction Manager API",
      version: "1.0.0",
      description: "API documentation for our transaction manager backend",
    },
    servers: [
      {
        url:
          process.env.NODE_ENV == "development"
            ? "http://localhost:3000"
            : process.env.SERVER_URL ||
              "https://dugsiye-full-stack-capstone-project.onrender.com",
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
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./backend/routes/*.js"], // Where your route files live
};

export const swaggerSpec = swaggerJSDoc(options);
