import { Elysia, t } from "elysia";
import { ProductModel } from "../models/product.model";
import { ProductService } from "../services/product.model";
import jwt from "@elysiajs/jwt";
import { Response } from "../utils/response";

export const setupProductController = (
  app: Elysia,
  productModel: ProductModel
) => {
  const productService = new ProductService(productModel);

  return app.group("/products", (app) =>
    app
      .use(
        jwt({
          name: "jwt",
          secret: process.env.JWT_SECRET as string,
        })
      )
      .derive(async ({ jwt, headers, set }) => {
        const authHeader = headers["authorization"];
        if (!authHeader) {
          // handle error for access token is not available
          set.status = 401;
          throw new Error("Access token is missing");
        }
        const token = authHeader.substring(7);
        const jwtPayload = await jwt.verify(token);
        if (!jwtPayload) {
          // handle error for access token is tempted or incorrect
          set.status = 403;
          throw new Error("Access token is invalid");
        }
      })
      .get(
        "/get_all",
        async ({ set }) => {
          const result = await productService.getAll();
          set.status = result.status_code;
          return result;
        },
        {
          detail: {
            tags: ["Products"],
            summary: "List user products",
            description:
              "Fetches all products owned by the authenticated user.",
          },
        }
      )
      .post(
        "/create",
        async ({ body, set }) => {
          const result = await productService.create(body);
          set.status = result.status_code;
          return result;
        },
        {
          body: t.Object({
            name: t.String(),
            price: t.Number(),
            user_id: t.Number(),
          }),
          detail: {
            tags: ["Products"],
            summary: "Create a product",
            description: "Adds a new product for the authenticated user.",
          },
        }
      )
      .put(
        "/:id",
        async ({ body, params: { id }, set }) => {
          const result = await productService.update(Number(id), body);
          set.status = result.status_code;
          return result;
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          body: t.Object({
            name: t.Optional(t.String()),
            price: t.Optional(t.Number()),
          }),
          detail: {
            tags: ["Products"],
            summary: "Update a product",
            description: "Updates a specific product owned by the user.",
          },
        }
      )
      .delete(
        "/:id",
        async ({ params: { id }, set }) => {
          const result = await productService.delete(Number(id));
          set.status = result.status_code;
          return result;
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          detail: {
            tags: ["Products"],
            summary: "Delete a product",
            description: "Deletes a specific product owned by the user.",
          },
        }
      )
  );
};
