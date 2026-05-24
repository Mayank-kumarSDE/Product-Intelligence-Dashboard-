import { Alert, Product } from "../db/models/index.js";
import { ok } from "../utils/api-response.js";

export async function getDashboardSummary(req, res) {
  const products = await Product.findAll();
  const unreadAlerts = await Alert.count({ where: { isRead: false } });

  const totalProducts = products.length;
  let invalidProducts = 0;
  let warningProducts = 0;
  let healthyProducts = 0;

  let highSeverityIssues = 0;
  let mediumSeverityIssues = 0;
  let lowSeverityIssues = 0;

  let weakListings = 0;
  let missingImages = 0;
  let invalidPrices = 0;

  for (const product of products) {
    if (product.validationStatus === "invalid") {
      invalidProducts++;
    } else if (product.validationStatus === "warning") {
      warningProducts++;
    } else {
      healthyProducts++;
    }

    const issues = product.validationErrors || [];
    for (const issue of issues) {
      if (issue.severity === "HIGH") highSeverityIssues++;
      else if (issue.severity === "MEDIUM") mediumSeverityIssues++;
      else if (issue.severity === "LOW") lowSeverityIssues++;

      if (issue.type === "weak_description") weakListings++;
      if (issue.type === "missing_image" || issue.type === "broken_image_url") missingImages++;
      if (issue.type === "invalid_price") invalidPrices++;
    }
  }

  const qualityScore = totalProducts > 0 ? Math.round((healthyProducts / totalProducts) * 100) : 100;

  return ok(res, {
    totalProducts,
    invalidProducts,
    warningProducts,
    healthyProducts,
    unreadAlerts,
    highSeverityIssues,
    mediumSeverityIssues,
    lowSeverityIssues,
    weakListings,
    missingImages,
    invalidPrices,
    qualityScore
  });
}
