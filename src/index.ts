import { Elysia } from "elysia";
import { setupAuthController } from "./controllers/auth.controller";
import { setupProductController } from "./controllers/product.controller";
import { setupUserController } from "./controllers/user.controller";
import { UserModel } from "./models/user.model";
import { ProductModel } from "./models/product.model";
import cors from "@elysiajs/cors";
import { PrismaClient } from "../generated/prisma";
import { openapi } from "@elysiajs/openapi";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

const userModel = new UserModel(prisma);
const productModel = new ProductModel(prisma);
const prefix = process.env.PREFIX || "api/v1";

const app = new Elysia({ prefix })
  .use(openapi())
  .use(
    cors({
      origin: "*", // or set specific domain: 'https://example.com'
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    })
  )
  .get("/health-check", () => "The Elysia is OK. 🦊")
  .use((app: Elysia) => setupAuthController(app, userModel))
  .use((app: Elysia) => setupProductController(app, productModel))
  .use((app: Elysia) => setupUserController(app, userModel))
  .listen(process.env.PORT as string);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}${prefix}`
);
console.log(
  `🏥 You can check the service is working at ${app.server?.hostname}:${app.server?.port}${prefix}/health-check`
);
console.log(
  `📚 API Docs: ${app.server?.hostname}:${app.server?.port}${prefix}/openapi`
);
