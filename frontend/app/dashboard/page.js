export const dynamic = 'force-dynamic';
import Link from "next/link";
import { AlertTriangle, Boxes, CheckCircle2, UploadCloud, ShieldAlert, Award, FileWarning } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { api } from "@/lib/api";

export default async function DashboardPage() {
  let summary = {
    totalProducts: 0,
    invalidProducts: 0,
    warningProducts: 0,
    healthyProducts: 0,
    unreadAlerts: 0,
    highSeverityIssues: 0,
    mediumSeverityIssues: 0,
    lowSeverityIssues: 0,
    weakListings: 0,
    missingImages: 0,
    invalidPrices: 0,
    qualityScore: 100
  };

  try {
    summary = await api("/api/dashboard/summary");
  } catch (err) {
    console.error("Dashboard page failed to fetch summary data", err);
  }

  return (
    <AppShell>
      <div className="section-title">
        <div>
          <h1>Dashboard</h1>
          <p>Flipkart catalogue health, validation risks, and pricing alerts.</p>
        </div>
        <div className="actions">
          <Link className="button" href="/upload">
            <UploadCloud size={18} />
            Upload Products
          </Link>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        <div className="card stat">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Total Products</span>
            <Boxes size={22} className="muted" />
          </div>
          <strong>{summary.totalProducts}</strong>
          <span className="muted" style={{ fontSize: 12 }}>Items in inventory</span>
        </div>

        <div className="card stat">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Listing Quality Score</span>
            <Award size={22} style={{ color: summary.qualityScore >= 80 ? "var(--good)" : "var(--warn)" }} />
          </div>
          <strong>{summary.qualityScore}%</strong>
          <span className="muted" style={{ fontSize: 12 }}>Healthy listings ratio</span>
        </div>

        <div className="card stat">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Healthy Listings</span>
            <CheckCircle2 size={22} style={{ color: "var(--good)" }} />
          </div>
          <strong>{summary.healthyProducts}</strong>
          <span className="muted" style={{ fontSize: 12 }}>Zero validation issues</span>
        </div>

        <div className="card stat">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Critical Alerts</span>
            <ShieldAlert size={22} style={{ color: summary.unreadAlerts > 0 ? "var(--bad)" : "var(--muted)" }} />
          </div>
          <strong>{summary.unreadAlerts}</strong>
          <span className="muted" style={{ fontSize: 12 }}>Action required alerts</span>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginBottom: 24 }}>
        {/* Quality Score Breakdown Card */}
        <div className="card">
          <h2>Catalogue Health Overview</h2>
          <div style={{ padding: "16px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14 }}>
              <span style={{ fontWeight: 600 }}>Listing Health Distribution</span>
              <span className="muted">{summary.qualityScore}% Healthy</span>
            </div>
            
            {/* Custom Multi-Segment Progress Bar */}
            <div style={{ height: 16, background: "#e5e7eb", borderRadius: 8, overflow: "hidden", display: "flex" }}>
              <div 
                style={{ 
                  width: `${summary.totalProducts > 0 ? (summary.healthyProducts / summary.totalProducts) * 100 : 100}%`, 
                  background: "var(--good)" 
                }} 
                title="Healthy"
              />
              <div 
                style={{ 
                  width: `${summary.totalProducts > 0 ? (summary.warningProducts / summary.totalProducts) * 100 : 0}%`, 
                  background: "var(--warn)" 
                }} 
                title="Warnings"
              />
              <div 
                style={{ 
                  width: `${summary.totalProducts > 0 ? (summary.invalidProducts / summary.totalProducts) * 100 : 0}%`, 
                  background: "var(--bad)" 
                }} 
                title="Invalid"
              />
            </div>

            <div style={{ display: "flex", gap: 16, marginTop: 16, fontSize: 13 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--good)", display: "inline-block" }} />
                <span>Healthy ({summary.healthyProducts})</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--warn)", display: "inline-block" }} />
                <span>Warning ({summary.warningProducts})</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--bad)", display: "inline-block" }} />
                <span>Invalid ({summary.invalidProducts})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Severity Metrics Card */}
        <div className="card">
          <h2>Validation Issues by Severity</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "8px 0" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                <span style={{ fontWeight: 600, color: "var(--bad)" }}>HIGH Severity Checks</span>
                <span>{summary.highSeverityIssues} issues</span>
              </div>
              <div className="progress" style={{ height: 8 }}><span style={{ width: `${Math.min(summary.highSeverityIssues * 15, 100)}%`, background: "var(--bad)" }} /></div>
            </div>
            
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                <span style={{ fontWeight: 600, color: "var(--warn)" }}>MEDIUM Severity Checks</span>
                <span>{summary.mediumSeverityIssues} issues</span>
              </div>
              <div className="progress" style={{ height: 8 }}><span style={{ width: `${Math.min(summary.mediumSeverityIssues * 15, 100)}%`, background: "var(--warn)" }} /></div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                <span style={{ fontWeight: 600, color: "var(--brand)" }}>LOW Severity Checks</span>
                <span>{summary.lowSeverityIssues} issues</span>
              </div>
              <div className="progress" style={{ height: 8 }}><span style={{ width: `${Math.min(summary.lowSeverityIssues * 15, 100)}%`, background: "var(--brand)" }} /></div>
            </div>
          </div>
        </div>
      </div>

      {/* Specific Alert Categories */}
      <div className="card">
        <h2>Catalogue Quality Diagnostics</h2>
        <p className="muted" style={{ marginBottom: 16 }}>Breakdown of key listing checkpoints requiring optimization.</p>
        <div className="grid grid-3">
          <div style={{ border: "1px solid var(--line)", borderRadius: 8, padding: 16, background: "var(--bg)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--bad)", marginBottom: 8 }}>
              <AlertTriangle size={18} />
              <strong style={{ fontSize: 14 }}>Invalid Prices</strong>
            </div>
            <span style={{ fontSize: 24, fontWeight: 700 }}>{summary.invalidPrices}</span>
            <p className="muted" style={{ fontSize: 12, marginTop: 4 }}>Products with non-positive or non-numeric pricing.</p>
          </div>

          <div style={{ border: "1px solid var(--line)", borderRadius: 8, padding: 16, background: "var(--bg)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--warn)", marginBottom: 8 }}>
              <FileWarning size={18} />
              <strong style={{ fontSize: 14 }}>Missing / Broken Images</strong>
            </div>
            <span style={{ fontSize: 24, fontWeight: 700 }}>{summary.missingImages}</span>
            <p className="muted" style={{ fontSize: 12, marginTop: 4 }}>Products without images or with invalid URLs.</p>
          </div>

          <div style={{ border: "1px solid var(--line)", borderRadius: 8, padding: 16, background: "var(--bg)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--brand)", marginBottom: 8 }}>
              <Boxes size={18} />
              <strong style={{ fontSize: 14 }}>Weak Product Descriptions</strong>
            </div>
            <span style={{ fontSize: 24, fontWeight: 700 }}>{summary.weakListings}</span>
            <p className="muted" style={{ fontSize: 12, marginTop: 4 }}>Products with description content under 20 characters.</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
