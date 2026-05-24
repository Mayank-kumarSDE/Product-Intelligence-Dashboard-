import { ok } from "../utils/api-response.js";
import {
  editProduct,
  enhanceProductTitle,
  getProduct,
  listProducts,
  refreshProductPrices
} from "../services/product.service.js";

export async function getProducts(req, res) {
  const products = await listProducts();
  return ok(res, products);
}

export async function getProductById(req, res) {
  const product = await getProduct(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }
  return ok(res, product);
}

export async function enhanceTitle(req, res) {
  const product = await enhanceProductTitle(req.params.id);
  return ok(res, product, "Title enhanced");
}

export async function refreshPrices(req, res) {
  const product = await refreshProductPrices(req.params.id);
  return ok(res, product, "Competitor prices refreshed");
}

export async function updateProductDetails(req, res) {
  const product = await editProduct(req.params.id, req.body);
  return ok(res, product, "Product updated");
}

export async function getProductIssues(req, res) {
  const product = await getProduct(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }
  return ok(res, product.validationErrors || []);
}

export async function getProductCompetitorPrices(req, res) {
  const product = await getProduct(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }
  return ok(res, product.competitorPrices || []);
}
