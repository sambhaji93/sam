require("dotenv").config();
const fs = require("fs");
const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: process.env.APP_NAME,
    description: process.env.APP_INFO,
  },
  host: "localhost:3000",
  basePath: "/",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    {
      name: "User",
      description: "Endpoints",
    },
  ],
  securityDefinitions: {
    apiKeyAuth: {
      type: "apiKey",
      in: "header",
      name: "Authorization",
      description: "Bareer ${token}",
    },
  },
};

let outputFile = "./public/api-docs/swagger-output.json";
if (!fs.existsSync(outputFile)) {
  outputFile = fs.openSync(outputFile, "w");
}
const endpointsFiles = ["./src/routes/index.js"];
swaggerAutogen(outputFile, endpointsFiles, doc);
