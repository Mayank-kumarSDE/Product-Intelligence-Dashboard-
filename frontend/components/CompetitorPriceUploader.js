"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export function CompetitorPriceUploader({ sku }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/api/competitors/upload`, {
        method: "POST",
        body: formData
      });

      const payload = await response.json();
      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || "Upload failed");
      }

      setMessage(`Matched ${payload.data.matchedCount}, skipped ${payload.data.skippedCount}.`);
      router.refresh();
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <h2 style={{ margin: 0 }}>Upload Competitor Prices</h2>
          <p className="muted" style={{ margin: 0 }}>Upload a competitor price CSV for SKU {sku} to refresh pricing and alerts.</p>
        </div>
      </div>

      <div className="actions" style={{ gap: 12 }}>
        <label className="button secondary" style={{ cursor: busy ? "not-allowed" : "pointer" }}>
          <UploadCloud size={18} />
          {busy ? "Uploading..." : "Upload Competitor CSV"}
          <input
            hidden
            type="file"
            accept=".csv,text/csv"
            disabled={busy}
            onChange={handleUpload}
          />
        </label>
        <div style={{ flex: 1 }}>
          {message ? <div className="badge completed" style={{ marginBottom: 8 }}>{message}</div> : null}
          {error ? <div className="badge invalid" style={{ marginBottom: 8 }}>{error}</div> : null}
        </div>
      </div>

      <p className="muted" style={{ marginTop: 12, fontSize: 13 }}>
        CSV should include SKU, competitor_name, competitor_price, competitor_url, currency, and optionally last_checked_at.
      </p>
    </div>
  );
}
