import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

export class UserModel {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createUser(username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
  }

  async findUserByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async comparePassword(plain: string, hashed: string) {
    return bcrypt.compare(plain, hashed);
  }
}
