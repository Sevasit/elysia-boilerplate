import { PrismaClient } from "@prisma/client";

export class ProductModel {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findAll() {
    return this.prisma.product.findMany();
  }

  async create(data: { name: string; price: number; user_id: number }) {
    return this.prisma.product.create({
      data: {
        ...data,
      },
    });
  }

  async findById(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: Partial<{ name: string; price: number }>) {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
