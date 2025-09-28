import { UserModel } from "../models/user.model";
import { Response } from "../utils/response";
import {
  ApiResponse,
  ErrorResponse,
  SuccessResponse,
} from "../utils/types/base";

export class AuthService {
  private userModel: UserModel;

  constructor(userModel: UserModel) {
    this.userModel = userModel;
  }

  async register(username: string, password: string) {
    try {
      const user = await this.userModel.createUser(username, password);
      return Response.success(201, "User created successfully", {
        user_id: user.id,
      });
    } catch (error) {
      return Response.error(
        400,
        "Registration failed",
        "Username already exists"
      );
    }
  }

  async login(
    username: string,
    password: string
  ): Promise<ApiResponse<{ user_id: number; username: string }>> {
    const user = await this.userModel.findUserByUsername(username);
    if (!user) {
      return Response.error(401, "Invalid credentials", "Username not found");
    }

    const isValid = await this.userModel.comparePassword(
      password,
      user.password
    );
    if (!isValid) {
      return Response.error(401, "Invalid credentials", "Incorrect password");
    }

    return Response.success(200, "Login successful", {
      user_id: user.id,
      username: user.username,
    });
  }
}
