"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export function EnhanceTitleNow({ productId }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleEnhance() {
    setBusy(true);
    try {
      await api(`/api/products/${productId}/enhance-title`, { method: "POST" });
    } catch (err) {
      alert(err.message || "Enhance failed");
    }
    setBusy(false);
    router.refresh();
  }

  return (
    <button className="button" style={{ display: "inline-flex", gap: 8 }} onClick={handleEnhance} disabled={busy}>
      <Sparkles size={16} /> {busy ? "Enhancing..." : "Enhance Title Now"}
    </button>
  );
}
