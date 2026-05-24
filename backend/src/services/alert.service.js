import { replaceProductAlerts } from "../repositories/alert.repository.js";

export async function syncAlertsForProduct(product, competitorPrices = [], previousPrices = []) {
  const alerts = [];
  const flipkartPrice = Number(product.price);
  const validationIssues = product.validationErrors || [];

  // Rule 1: HIGH severity (critical) if product has no title, no price, or invalid price
  const hasCriticalValidation = validationIssues.some(
    (issue) =>
      issue.severity === "HIGH" &&
      (issue.type === "missing_title" || issue.type === "invalid_price")
  );
  if (hasCriticalValidation) {
    alerts.push({
      type: "validation_critical",
      severity: "critical",
      message: "Product lacks essential data (no title, no price, or invalid price)."
    });
  }

  // Rule 2: HIGH severity (critical) if Flipkart price is >10% higher than lowest competitor price
  if (competitorPrices.length > 0 && flipkartPrice > 0) {
    const validCompetitorPrices = competitorPrices
      .map((c) => Number(c.competitorPrice))
      .filter((p) => p > 0);

    if (validCompetitorPrices.length > 0) {
      const lowestCompetitor = Math.min(...validCompetitorPrices);
      if (flipkartPrice > lowestCompetitor * 1.10) {
        const percentDiff = Math.round(((flipkartPrice - lowestCompetitor) / lowestCompetitor) * 100);
        alerts.push({
          type: "price_high",
          severity: "critical",
          message: `Flipkart price is ${percentDiff}% higher than the lowest competitor (Lowest: Rs. ${lowestCompetitor}).`
        });
      }
    }
  }

  // Rule 3: MEDIUM severity (warning) if title is too weak or important attributes are missing
  const hasWarningValidation = validationIssues.some(
    (issue) =>
      issue.severity === "MEDIUM" &&
      (issue.type === "short_title" || issue.type === "missing_attributes")
  );
  if (hasWarningValidation) {
    alerts.push({
      type: "validation_warning",
      severity: "warning",
      message: "Listing attributes are missing or title is too weak."
    });
  }

  // Rule 4: MEDIUM severity (warning) if a competitor price drops significantly (>15%) during refresh
  if (previousPrices.length > 0 && competitorPrices.length > 0) {
    for (const newPrice of competitorPrices) {
      const oldPrice = previousPrices.find(
        (p) => p.competitorName === newPrice.competitorName
      );
      if (oldPrice) {
        const prevVal = Number(oldPrice.competitorPrice);
        const newVal = Number(newPrice.competitorPrice);
        if (prevVal > 0 && newVal < prevVal * 0.85) {
          const dropPercent = Math.round(((prevVal - newVal) / prevVal) * 100);
          alerts.push({
            type: "competitor_price_drop",
            severity: "warning",
            message: `Competitor ${newPrice.competitorName} price dropped significantly by ${dropPercent}% (from Rs. ${prevVal} to Rs. ${newVal}).`
          });
        }
      }
    }
  }

  // Rule 5: LOW severity (info) for weak descriptions or out-of-stock products
  const hasInfoValidation = validationIssues.some(
    (issue) =>
      issue.severity === "LOW" &&
      (issue.type === "weak_description" || issue.type === "out_of_stock")
  );
  if (hasInfoValidation) {
    alerts.push({
      type: "validation_info",
      severity: "info",
      message: "Product description is weak or item is currently out of stock."
    });
  }

  // Save the alerts to the database
  const savedAlerts = await replaceProductAlerts(product.id, alerts);

  return savedAlerts;
}
