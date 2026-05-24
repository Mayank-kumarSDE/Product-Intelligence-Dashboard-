import { Alert, Product } from "../db/models/index.js";

export async function replaceProductAlerts(productId, alerts) {
  await Alert.destroy({ where: { productId } });
  if (!alerts.length) return [];
  return Alert.bulkCreate(alerts.map((alert) => ({ ...alert, productId })));
}

export function findAlerts() {
  return Alert.findAll({
    include: [{ model: Product, as: "product" }],
    order: [["createdAt", "DESC"]]
  });
}

export function markAlertRead(id) {
  return Alert.update({ isRead: true }, { where: { id } });
}
