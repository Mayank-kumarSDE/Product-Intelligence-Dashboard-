"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RefreshCcw, Sparkles } from "lucide-react";
import { api } from "@/lib/api";

export function ProductActions({ productId, product }) {
  const router = useRouter();
  const [busy, setBusy] = useState("");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: product.title || "",
    description: product.description || "",
    category: product.category || "",
    price: product.price || "",
    inventory: product.inventory || 0,
    imageUrl: product.imageUrl || ""
  });

  async function run(path, label) {
    setBusy(label);
    try {
      await api(path, { method: "POST" });
    } catch (err) {
      alert(err.message || "Action failed");
    }
    setBusy("");
    router.refresh();
  }

  async function saveProduct(event) {
    event.preventDefault();
    setBusy("save");
    await api(`/api/products/${productId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });
    setBusy("");
    setEditing(false);
    router.refresh();
  }

  return (
    <>
      <div className="actions">
        <button
          className="button"
          disabled={Boolean(busy)}
          onClick={() => run(`/api/products/${productId}/enhance-title`, "title")}
        >
          <Sparkles size={18} />
          {busy === "title" ? "Enhancing..." : "Enhance Title"}
        </button>
        <button
          className="button secondary"
          disabled={Boolean(busy)}
          onClick={() => run(`/api/products/${productId}/refresh-prices`, "prices")}
        >
          <RefreshCcw size={18} />
          {busy === "prices" ? "Refreshing..." : "Refresh Prices"}
        </button>
        <button className="button secondary" onClick={() => setEditing((value) => !value)}>
          Edit
        </button>
      </div>

      {editing ? (
        <form className="card stack" onSubmit={saveProduct} style={{ marginTop: 16 }}>
          <input
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            placeholder="Title"
          />
          <input
            value={form.category}
            onChange={(event) => setForm({ ...form, category: event.target.value })}
            placeholder="Category"
          />
          <input
            value={form.price}
            onChange={(event) => setForm({ ...form, price: event.target.value })}
            placeholder="Price"
            type="number"
          />
          <input
            value={form.inventory}
            onChange={(event) => setForm({ ...form, inventory: event.target.value })}
            placeholder="Inventory"
            type="number"
          />
          <input
            value={form.imageUrl}
            onChange={(event) => setForm({ ...form, imageUrl: event.target.value })}
            placeholder="Image URL"
          />
          <textarea
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            placeholder="Description"
            rows={4}
          />
          <button className="button" disabled={Boolean(busy)} type="submit">
            {busy === "save" ? "Saving..." : "Save Changes"}
          </button>
        </form>
      ) : null}
    </>
  );
}
