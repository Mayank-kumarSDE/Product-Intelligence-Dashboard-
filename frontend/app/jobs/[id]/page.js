"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { api } from "@/lib/api";

export default function JobPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const data = await api(`/api/jobs/${id}`);
        if (active) setJob(data);
      } catch (err) {
        if (active) setError(err.message);
      }
    }

    load();
    const timer = setInterval(load, 1500);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [id]);

  return (
    <AppShell>
      <div className="section-title">
        <div>
          <h1>Processing Job</h1>
          <p>Job ID: {id}</p>
        </div>
      </div>

      {error ? <div className="card badge invalid">{error}</div> : null}

      <div className="card stack">
        {!job ? (
          <p className="muted">Loading job...</p>
        ) : (
          <>
            <div className="actions">
              <span className={`badge ${job.status}`}>{job.status}</span>
              <span className="muted">{job.totalProducts || 0} products</span>
            </div>
            <div className="progress">
              <span style={{ width: `${job.progress}%` }} />
            </div>
            <p className="muted">{job.progress}% complete</p>

            {job.status === "processing" || job.status === "queued" ? (
              <div className="actions muted">
                <LoaderCircle size={18} />
                Processing catalogue intelligence
              </div>
            ) : null}

            {job.status === "completed" ? (
              <Link className="button" href="/products">
                View Products <ArrowRight size={18} />
              </Link>
            ) : null}

            {job.status === "failed" ? <p className="badge invalid">{job.errorMessage}</p> : null}
          </>
        )}
      </div>
    </AppShell>
  );
}
