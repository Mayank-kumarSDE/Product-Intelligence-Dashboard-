"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { api } from "@/lib/api";

export function AlertActions({ alertId, isRead }) {
  const router = useRouter();

  async function markRead() {
    await api(`/api/alerts/${alertId}/read`, { method: "PATCH" });
    router.refresh();
  }

  if (isRead) {
    return <span className="muted">Read</span>;
  }

  return (
    <button className="button secondary" onClick={markRead}>
      <Check size={16} />
      Read
    </button>
  );
}
