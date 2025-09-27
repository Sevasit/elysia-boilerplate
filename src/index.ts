import { Elysia } from "elysia";
// import { openapi } from '@elysiajs/openapi';
import { PrismaClient } from "@prisma/client";
import { setupAuthController } from "./controllers/auth.controller";
import { setupProductController } from "./controllers/product.controller";
import { UserModel } from "./models/user.model";
import { ProductModel } from "./models/product.model";
import cors from "@elysiajs/cors";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

const userModel = new UserModel(prisma);
const productModel = new ProductModel(prisma);

const app = new Elysia({ prefix: "api/v1" })
  .use(
    cors({
      origin: "*", // or set specific domain: 'https://example.com'
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    })
  )
  .get("/health-check", () => "The Elysia is OK. 🦊")
  .use((app: Elysia) => setupAuthController(app, userModel))
  .use((app: Elysia) => setupProductController(app, productModel))
  .listen(process.env.PORT as string);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
