import { Request, Response } from "express";
import mongoose from "mongoose";
import productModel from "../models/product.model";

// Create a new Product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const product = new productModel(data);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ error: err.message });
    }

    console.error("Failed to create product:", err);
    return res.status(500).json({ error: "Failed to create product." });
  }
};

// Get All Products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await productModel.find();
    res.status(200).json(products);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ error: err.message });
    }

    console.error("Failed to create product:", err);
    return res.status(500).json({ error: "Failed to create product." });
  }
};

// Get Product By Id
export const getProductById = async (req: Request, res: Response) => {
  try {
    const products = await productModel.findById(req.params.id);
    res.status(200).json(products);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ error: err.message });
    }

    console.error("Failed to create product:", err);
    return res.status(500).json({ error: "Failed to create product." });
  }
};

// Count Products
export const countProducts = async (req: Request, res: Response) => {
  try {
    const productsCount = await productModel.countDocuments();
    res.status(200).json(productsCount);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ error: err.message });
    }

    console.error("Failed to create product:", err);
    return res.status(500).json({ error: "Failed to create product." });
  }
};

// Delete Product By Id
export const deleteProductById = async (req: Request, res: Response) => {
  try {
    const deletedProduct = await productModel.deleteOne({ _id: req.params.id });
    res.status(200).json(deletedProduct);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ error: err.message });
    }

    console.error("Failed to create product:", err);
    return res.status(500).json({ error: "Failed to create product." });
  }
};

// Update Product By Id
export const updateProductById = async (req: Request, res: Response) => {
  try {
    const updatedProduct = await productModel.updateOne(
      { _id: req.params.id },
      req.body,
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ error: err.message });
    }

    console.error("Failed to create product:", err);
    return res.status(500).json({ error: "Failed to create product." });
  }
};
