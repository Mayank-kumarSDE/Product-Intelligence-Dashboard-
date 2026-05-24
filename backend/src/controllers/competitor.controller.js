import { ok } from "../utils/api-response.js";
import { parseCompetitorCsv } from "../utils/csv-parser.js";
import { Product } from "../db/models/index.js";
import { saveUploadedCompetitorPrices, refreshCompetitorPrices } from "../services/competitor.service.js";
import { findProducts } from "../repositories/product.repository.js";

export async function uploadCompetitorPricesCsv(req, res) {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "CSV file is required" });
  }

  const items = parseCompetitorCsv(req.file.buffer);
  if (!items.length) {
    return res.status(400).json({ success: false, message: "CSV does not contain competitor prices" });
  }

  // Group by SKU
  const skuGroups = {};
  for (const item of items) {
    if (!item.sku) continue;
    if (!skuGroups[item.sku]) {
      skuGroups[item.sku] = [];
    }
    skuGroups[item.sku].push({
      competitorName: item.competitorName,
      competitorPrice: item.competitorPrice,
      url: item.url,
      currency: item.currency,
      capturedAt: item.capturedAt
    });
  }

  let matchedCount = 0;
  let skippedCount = 0;

  for (const sku of Object.keys(skuGroups)) {
    const product = await Product.findOne({ where: { sku } });
    if (product) {
      await saveUploadedCompetitorPrices(product.id, skuGroups[sku]);
      matchedCount++;
    } else {
      skippedCount++;
    }
  }

  return ok(res, { matchedCount, skippedCount }, `Successfully processed competitor prices. Matched: ${matchedCount}, Skipped: ${skippedCount}`);
}

export async function triggerCompetitorRefresh(req, res) {
  const products = await findProducts();
  for (const product of products) {
    await refreshCompetitorPrices(product);
  }
  return ok(res, null, "All competitor prices refreshed and alerts updated");
}
