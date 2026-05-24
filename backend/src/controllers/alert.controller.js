import { findAlerts, markAlertRead } from "../repositories/alert.repository.js";
import { ok } from "../utils/api-response.js";

export async function getAlerts(req, res) {
  const alerts = await findAlerts();
  return ok(res, alerts);
}

export async function readAlert(req, res) {
  await markAlertRead(req.params.id);
  return ok(res, { id: req.params.id }, "Alert marked as read");
}
