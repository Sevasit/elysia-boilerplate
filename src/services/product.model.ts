import { ProductModel } from "../models/product.model";
import { Response } from "../utils/response";

export class ProductService {
  private productModel: ProductModel;

  constructor(productModel: ProductModel) {
    this.productModel = productModel;
  }

  async getAll() {
    const products = await this.productModel.findAll();
    return Response.success(200, "Products retrieved successfully", products);
  }

  async create(data: { name: string; price: number; user_id: number }) {
    const product = await this.productModel.create(data);
    return Response.success(201, "Product created successfully", product);
  }

  async update(id: number, data: Partial<{ name: string; price: number }>) {
    const product = await this.productModel.findById(id);
    if (!product) {
      return Response.error(
        404,
        "Cannot update product",
        "Product does not exist"
      );
    }
    const updated = await this.productModel.update(id, data);
    return Response.success(200, "Product updated successfully", updated);
  }

  async delete(id: number) {
    const product = await this.productModel.findById(id);
    if (!product) {
      return Response.error(
        404,
        "Cannot delete product",
        "Product does not exist"
      );
    }
    await this.productModel.delete(id);
    return Response.success(204, "Product deleted successfully", null);
  }
}
