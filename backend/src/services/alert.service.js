import { replaceProductAlerts } from "../repositories/alert.repository.js";

export async function syncAlertsForProduct(product, competitorPrices) {
  const alerts = [];
  const productPrice = Number(product.price);

  const cheaperCompetitors = competitorPrices.filter(
    (item) => Number(item.competitorPrice) < productPrice
  );

  if (cheaperCompetitors.length >= 3) {
    alerts.push({
      type: "price_position",
      severity: "critical",
      message: `${cheaperCompetitors.length} competitors are priced below this product`
    });
  } else if (cheaperCompetitors.length > 0) {
    alerts.push({
      type: "price_position",
      severity: "warning",
      message: `${cheaperCompetitors.length} competitors are cheaper than this product`
    });
  }

  if (product.validationStatus === "invalid") {
    alerts.push({
      type: "validation",
      severity: "critical",
      message: "Product has blocking validation issues"
    });
  }

  if (product.validationStatus === "warning") {
    alerts.push({
      type: "validation",
      severity: "warning",
      message: "Product needs catalogue improvements"
    });
  }

  return replaceProductAlerts(product.id, alerts);
}
