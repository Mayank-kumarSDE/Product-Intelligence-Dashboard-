import { Router } from "express";
import {
  enhanceTitle,
  getProductById,
  getProducts,
  refreshPrices,
  updateProductDetails,
  getProductIssues,
  getProductCompetitorPrices
} from "../controllers/product.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

export const productRouter = Router();

productRouter.get("/", asyncHandler(getProducts));
productRouter.get("/:id", asyncHandler(getProductById));
productRouter.get("/:id/issues", asyncHandler(getProductIssues));
productRouter.get("/:id/competitor-prices", asyncHandler(getProductCompetitorPrices));
productRouter.patch("/:id", asyncHandler(updateProductDetails));
productRouter.post("/:id/enhance-title", asyncHandler(enhanceTitle));
productRouter.post("/:id/refresh-prices", asyncHandler(refreshPrices));
