import { ProductModel } from "../models/product.model";
import { Response } from "../utils/response";

export class ProductService {
  private productModel: ProductModel;

  constructor(productModel: ProductModel) {
    this.productModel = productModel;
  }

  async getAll(userId: number) {
    const products = await this.productModel.findAllByUserId(userId);
    return Response.success(200, "Products retrieved successfully", products);
  }

  async create(userId: number, data: { name: string; price: number }) {
    const product = await this.productModel.create(userId, data);
    return Response.success(201, "Product created successfully", product);
  }

  async update(
    id: number,
    userId: number,
    data: Partial<{ name: string; price: number }>
  ) {
    const product = await this.productModel.findById(id);
    if (!product || product.userId !== userId) {
      return Response.error(
        404,
        "Product not found",
        "Product does not exist or belongs to another user"
      );
    }
    const updated = await this.productModel.update(id, data);
    return Response.success(200, "Product updated successfully", updated);
  }

  async delete(id: number, userId: number) {
    const product = await this.productModel.findById(id);
    if (!product || product.userId !== userId) {
      return Response.error(
        404,
        "Product not found",
        "Product does not exist or belongs to another user"
      );
    }
    await this.productModel.delete(id);
    return Response.success(204, "Product deleted successfully", null);
  }
}
