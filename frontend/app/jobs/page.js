"use client";

import { useEffect, useState, Fragment } from "react";
import { AppShell } from "@/components/AppShell";
import { api } from "@/lib/api";
import { RefreshCw, Play, AlertCircle, FileText, CheckCircle2, Loader2, ChevronDown, ChevronUp } from "lucide-react";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedJobId, setExpandedJobId] = useState(null);

  async function fetchJobs() {
    try {
      const data = await api("/api/jobs");
      setJobs(data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load jobs list.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleExpand = (id) => {
    if (expandedJobId === id) {
      setExpandedJobId(null);
    } else {
      setExpandedJobId(id);
    }
  };

  return (
    <AppShell>
      <div className="section-title">
        <div>
          <h1>Jobs History</h1>
          <p>Monitor catalogue ingestion pipelines, CSV parsing tasks, and data updates.</p>
        </div>
        <button className="button secondary" onClick={() => { setLoading(true); fetchJobs(); }}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {loading && jobs.length === 0 ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "60px 0" }}>
          <Loader2 size={32} className="spinner" />
          <span style={{ marginLeft: 10 }} className="muted">Loading jobs list...</span>
        </div>
      ) : error ? (
        <div className="card" style={{ color: "var(--bad)", display: "flex", alignItems: "center", gap: 10 }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table className="table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th style={{ width: 40 }}></th>
                <th>Job ID</th>
                <th>Type</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Products Count</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => {
                const isExpanded = expandedJobId === job.id;
                const date = new Date(job.createdAt).toLocaleString();
                const failedRows = job.failedRows || [];

                return (
                  <Fragment key={job.id}>
                    <tr style={{ cursor: "pointer" }} onClick={() => toggleExpand(job.id)}>
                      <td>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </td>
                      <td style={{ fontFamily: "monospace", fontSize: 13 }}>
                        {job.id.substring(0, 8)}...
                      </td>
                      <td>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
                          <FileText size={14} className="muted" />
                          {job.type.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${job.status}`}>
                          {job.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 120 }}>
                          <div className="progress" style={{ flex: 1, height: 6 }}>
                            <span style={{ 
                              width: `${job.progress}%`,
                              background: job.status === "failed" ? "var(--bad)" : "var(--brand)"
                            }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 600 }}>{job.progress}%</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{job.totalProducts}</td>
                      <td className="muted" style={{ fontSize: 13 }}>{date}</td>
                    </tr>
                    
                    {isExpanded && (
                      <tr style={{ background: "var(--bg)" }}>
                        <td colSpan="7" style={{ padding: "16px 24px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <div>
                              <strong style={{ fontSize: 13, display: "block", marginBottom: 4 }}>Full Job ID:</strong>
                              <span style={{ fontFamily: "monospace", fontSize: 13 }}>{job.id}</span>
                            </div>

                            {job.errorMessage && (
                              <div style={{ color: "var(--bad)", borderLeft: "3px solid var(--bad)", paddingLeft: 10 }}>
                                <strong style={{ fontSize: 13, display: "block" }}>Error Summary:</strong>
                                <span style={{ fontSize: 13 }}>{job.errorMessage}</span>
                              </div>
                            )}

                            {failedRows.length > 0 ? (
                              <div>
                                <strong style={{ fontSize: 13, display: "block", marginBottom: 6, color: "var(--bad)" }}>
                                  Failed Rows / Parsing Exceptions ({failedRows.length})
                                </strong>
                                <div style={{ border: "1px solid var(--line)", borderRadius: 6, maxHeight: 200, overflowY: "auto", background: "white" }}>
                                  <table className="table" style={{ margin: 0, fontSize: 12 }}>
                                    <thead style={{ position: "sticky", top: 0, background: "var(--bg)" }}>
                                      <tr>
                                        <th>Row #</th>
                                        <th>Identifier / SKU</th>
                                        <th>Error Reason</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {failedRows.map((row, idx) => (
                                        <tr key={idx}>
                                          <td style={{ fontWeight: 600 }}>{row.rowNum || idx + 1}</td>
                                          <td style={{ fontFamily: "monospace" }}>{row.sku || row.identifier || "N/A"}</td>
                                          <td style={{ color: "var(--bad)" }}>{row.reason || "Unknown parsing error"}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            ) : job.status === "completed" ? (
                              <div style={{ color: "var(--good)", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                                <CheckCircle2 size={16} /> All rows parsed and validated successfully.
                              </div>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
              {jobs.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "24px 0" }} className="muted">
                    No ingestion jobs have been run yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
