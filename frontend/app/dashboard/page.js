import Link from "next/link";
import { AlertTriangle, Boxes, CheckCircle2, UploadCloud } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { api } from "@/lib/api";

export default async function DashboardPage() {
  let summary = {
    totalProducts: 0,
    invalidProducts: 0,
    warningProducts: 0,
    unreadAlerts: 0
  };

  try {
    summary = await api("/api/dashboard/summary");
  } catch {}

  return (
    <AppShell>
      <div className="section-title">
        <div>
          <h1>Dashboard</h1>
          <p>Catalogue health, validation risks, and pricing alerts.</p>
        </div>
        <Link className="button" href="/upload">
          <UploadCloud size={18} />
          Upload
        </Link>
      </div>

      <div className="grid grid-4">
        <div className="card stat">
          <Boxes size={22} />
          <strong>{summary.totalProducts}</strong>
          Products
        </div>
        <div className="card stat">
          <CheckCircle2 size={22} />
          <strong>{Math.max(summary.totalProducts - summary.invalidProducts - summary.warningProducts, 0)}</strong>
          Healthy
        </div>
        <div className="card stat">
          <AlertTriangle size={22} />
          <strong>{summary.warningProducts}</strong>
          Warnings
        </div>
        <div className="card stat">
          <AlertTriangle size={22} />
          <strong>{summary.unreadAlerts}</strong>
          Unread Alerts
        </div>
      </div>
    </AppShell>
  );
}
