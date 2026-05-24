"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "valid", label: "Valid" },
  { value: "warning", label: "Warning" },
  { value: "invalid", label: "Invalid" }
];

export function ProductFilters({ products }) {
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");

  const categories = useMemo(() => {
    const unique = new Set(products.map((product) => product.category || "General"));
    return ["all", ...Array.from(unique).sort()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesStatus = status === "all" || product.validationStatus === status;
      const matchesCategory = category === "all" || (product.category || "General") === category;
      const normalizedQuery = query.trim().toLowerCase();
      const matchesQuery =
        !normalizedQuery ||
        product.sku?.toLowerCase().includes(normalizedQuery) ||
        (product.title || "").toLowerCase().includes(normalizedQuery) ||
        (product.enhancedTitle || "").toLowerCase().includes(normalizedQuery);

      return matchesStatus && matchesCategory && matchesQuery;
    });
  }, [products, status, category, query]);

  return (
    <>
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="grid grid-4" style={{ gap: 12, alignItems: "center" }}>
          <div>
            <label className="muted" style={{ display: "block", marginBottom: 6, fontSize: 12 }}>Search SKU or title</label>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products..."
            />
          </div>

          <div>
            <label className="muted" style={{ display: "block", marginBottom: 6, fontSize: 12 }}>Validation status</label>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="muted" style={{ display: "block", marginBottom: 6, fontSize: 12 }}>Category</label>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((name) => (
                <option key={name} value={name}>{name === "all" ? "All Categories" : name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Title</th>
              <th>Price</th>
              <th>Competitor Avg</th>
              <th>Status</th>
              <th>Alerts</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.sku}</td>
                  <td>{product.enhancedTitle || product.title}</td>
                  <td>Rs. {Number(product.price).toFixed(0)}</td>
                  <td>{product.competitorPrices?.length ? `Rs. ${Math.round(product.competitorPrices.reduce((sum, item) => sum + Number(item.competitorPrice), 0) / product.competitorPrices.length)}` : "-"}</td>
                  <td>
                    <span className={`badge ${product.validationStatus}`}>{product.validationStatus}</span>
                  </td>
                  <td>{product.alerts?.length || 0}</td>
                  <td>
                    <Link className="button secondary" href={`/products/${product.id}`}>
                      Open
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="muted" style={{ textAlign: "center", padding: 20 }}>
                  No products match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
