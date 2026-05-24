import { Alert, Product } from "../db/models/index.js";
import { ok } from "../utils/api-response.js";

export async function getDashboardSummary(req, res) {
  const [totalProducts, invalidProducts, warningProducts, unreadAlerts] = await Promise.all([
    Product.count(),
    Product.count({ where: { validationStatus: "invalid" } }),
    Product.count({ where: { validationStatus: "warning" } }),
    Alert.count({ where: { isRead: false } })
  ]);

  return ok(res, {
    totalProducts,
    invalidProducts,
    warningProducts,
    unreadAlerts
  });
}
