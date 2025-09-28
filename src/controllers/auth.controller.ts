import { Elysia, t } from "elysia";
import { AuthService } from "../services/auth.service";
import { UserModel } from "../models/user.model";
import { Response } from "../utils/response";
import jwt from "@elysiajs/jwt";

export const setupAuthController = (app: Elysia, userModel: UserModel) => {
  const authService = new AuthService(userModel);

  return app.group("/auth", (app) =>
    app
      .use(
        jwt({
          name: "jwt",
          secret: process.env.JWT_SECRET as string,
          exp: process.env.EXPIRE_IN as string | "1h",
        })
      )
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
      .post(
        "/login",
        async ({ body, jwt, cookie, set }) => {
          const result = await authService.login(body.username, body.password);
          if (!result.success) {
            set.status = result.status_code;
            return result;
          }
          const token = await jwt.sign(result.data);
          // cookie.jwt.set({
          //   value: token,
          //   httpOnly: true,
          //   secure: process.env.NODE_ENV === "production",
          // });
          return Response.success(200, result.message, { token });
        },
        {
          body: t.Object({
            username: t.String(),
            password: t.String(),
          }),
          detail: {
            tags: ["Auth"],
            summary: "Login a user",
            description:
              "Authenticates user and sets JWT cookie. Returns token.",
          },
        }
      )
  );
};
