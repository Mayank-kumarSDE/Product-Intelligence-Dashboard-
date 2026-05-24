import Link from "next/link";
import { RotateCw } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { api } from "@/lib/api";

function averagePrice(prices = []) {
  if (!prices.length) return "-";
  const average = prices.reduce((sum, item) => sum + Number(item.competitorPrice), 0) / prices.length;
  return `Rs. ${Math.round(average)}`;
}

export default async function ProductsPage() {
  let products = [];

  try {
    products = await api("/api/products");
  } catch {}

  return (
    <AppShell>
      <div className="section-title">
        <div>
          <h1>Products</h1>
          <p>Review extracted catalogue data, validation status, and competitor pricing.</p>
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
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.sku}</td>
                <td>{product.enhancedTitle || product.title}</td>
                <td>Rs. {Number(product.price).toFixed(0)}</td>
                <td>{averagePrice(product.competitorPrices)}</td>
                <td>
                  <span className={`badge ${product.validationStatus}`}>{product.validationStatus}</span>
                </td>
                <td>{product.alerts?.length || 0}</td>
                <td>
                  <Link className="button secondary" href={`/products/${product.id}`}>
                    <RotateCw size={16} />
                    Open
                  </Link>
                </td>
              </tr>
            ))}
            {!products.length ? (
              <tr>
                <td colSpan="7" className="muted">
                  No products yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
