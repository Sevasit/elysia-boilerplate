import { Elysia, t } from "elysia";
import { AuthService } from "../services/auth.service";
import { UserModel } from "../models/user.model";
import jwt from "@elysiajs/jwt";

export const setupUserController = (app: Elysia, userModel: UserModel) => {
  const authService = new AuthService(userModel);

  return app.group("/user", (app) =>
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
      .post(
        "/register",
        async ({ body, set }) => {
          const result = await authService.register(
            body.username,
            body.password
          );
          set.status = result.status_code;
          return result;
        },
        {
          body: t.Object({
            username: t.String(),
            password: t.String(),
          }),
          detail: {
            tags: ["Auth"],
            summary: "Register a new user",
            description:
              "Creates a user with hashed password. Returns user ID on success.",
          },
        }
      )
  );
};
