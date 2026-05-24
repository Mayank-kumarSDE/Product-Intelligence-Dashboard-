import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { AlertActions } from "@/components/AlertActions";
import { api } from "@/lib/api";

export default async function AlertsPage() {
  let alerts = [];

  try {
    alerts = await api("/api/alerts");
  } catch {}

  return (
    <AppShell>
      <div className="section-title">
        <div>
          <h1>Alerts</h1>
          <p>In-app notifications generated from validation and competitor pricing.</p>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Severity</th>
              <th>Product</th>
              <th>Message</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert.id}>
                <td>
                  <span className={`badge ${alert.severity}`}>{alert.severity}</span>
                </td>
                <td>
                  <Link href={`/products/${alert.productId}`}>
                    {alert.product?.sku || "Product"}
                  </Link>
                </td>
                <td>{alert.message}</td>
                <td>
                  <AlertActions alertId={alert.id} isRead={alert.isRead} />
                </td>
              </tr>
            ))}
            {!alerts.length ? (
              <tr>
                <td colSpan="4" className="muted">
                  No alerts yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
