"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileSpreadsheet, UploadCloud, Video } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { uploadFile } from "@/lib/api";

export default function UploadPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [enhanceTitles, setEnhanceTitles] = useState(true);

  async function handleUpload(event, type) {
    const file = event.target.files?.[0];
    if (!file) return;

    setBusy(true);
    setError("");

    try {
      const job = await uploadFile(type === "video" ? "/api/uploads/video" : "/api/uploads/csv", file, {
        enhanceTitles
      });
      router.push(`/jobs/${job.id}`);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <AppShell>
      <div className="section-title">
        <div>
          <h1>Upload Products</h1>
          <p>Start with a product video mock extraction or a real product CSV import.</p>
        </div>
      </div>

      {error ? <div className="card badge invalid">{error}</div> : null}

      <div className="card" style={{ marginBottom: 16 }}>
        <label className="actions" style={{ alignItems: "center" }}>
          <input
            checked={enhanceTitles}
            onChange={(event) => setEnhanceTitles(event.target.checked)}
            type="checkbox"
          />
          Enable title enhancement during processing
        </label>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="upload-box">
            <Video size={36} />
            <div>
              <h2>Product Video</h2>
              <p className="muted">Creates a real processing job and mocks extracted catalogue items.</p>
            </div>
            <label className="button">
              <UploadCloud size={18} />
              {busy ? "Uploading..." : "Upload Video"}
              <input hidden type="file" accept="video/*" onChange={(event) => handleUpload(event, "video")} />
            </label>
          </div>
        </div>

        <div className="card">
          <div className="upload-box">
            <FileSpreadsheet size={36} />
            <div>
              <h2>Product CSV</h2>
              <p className="muted">Parses real CSV rows and runs validation, pricing, and alerts.</p>
            </div>
            <label className="button secondary">
              <UploadCloud size={18} />
              {busy ? "Uploading..." : "Upload CSV"}
              <input hidden type="file" accept=".csv,text/csv" onChange={(event) => handleUpload(event, "csv")} />
            </label>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
