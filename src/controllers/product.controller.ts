import { Elysia, t } from "elysia";
import { ProductModel } from "../models/product.model";
import { Response } from "../utils/response";
import { ProductService } from "../services/product.model";

export const setupProductController = (
  app: Elysia,
  productModel: ProductModel
) => {
  const productService = new ProductService(productModel);

  return app.group("/products", (app) =>
    app
      .use(async ({ jwt, headers, set }) => {
        const token =
          headers.authorization?.replace("Bearer ", "") ||
          (await jwt.get(headers.cookie))?.value;
        if (!token) {
          set.status = 401;
          return Response.error(401, "Unauthorized", "No token provided");
        }
        const payload = await jwt.verify(token);
        if (!payload) {
          set.status = 401;
          return Response.error(401, "Unauthorized", "Invalid token");
        }
        return { userId: Number(payload.userId) };
      })
      .get(
        "/get_all",
        async ({ userId, set }) => {
          const result = await productService.getAll(userId);
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
        "/get_detail",
        async ({ body, userId, set }) => {
          const result = await productService.create(userId, body);
          set.status = result.status_code;
          return result;
        },
        {
          body: t.Object({
            name: t.String(),
            price: t.Number(),
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
        async ({ params, body, userId, set }) => {
          const result = await productService.update(
            Number(params.id),
            userId,
            body
          );
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
        async ({ params, userId, set }) => {
          const result = await productService.delete(Number(params.id), userId);
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
