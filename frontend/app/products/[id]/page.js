import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ProductActions } from "@/components/ProductActions";
import { api } from "@/lib/api";

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  let product;

  try {
    product = await api(`/api/products/${id}`);
  } catch {
    notFound();
  }

  return (
    <AppShell>
      <div className="section-title">
        <div>
          <h1>{product.enhancedTitle || product.title}</h1>
          <p>{product.sku} · {product.category}</p>
        </div>
        <ProductActions product={product} productId={product.id} />
      </div>

      <div className="grid grid-2">
        <div className="card stack">
          <h2>Catalogue</h2>
          <p>{product.description || "No description provided."}</p>
          <p>
            <strong>Original title:</strong> {product.title}
          </p>
          <p>
            <strong>Enhanced title:</strong> {product.enhancedTitle || "Not generated yet"}
          </p>
          <p>
            <strong>Price:</strong> Rs. {Number(product.price).toFixed(0)}
          </p>
          <p>
            <strong>Inventory:</strong> {product.inventory}
          </p>
          <span className={`badge ${product.validationStatus}`}>{product.validationStatus}</span>
        </div>

        <div className="card stack">
          <h2>Validation</h2>
          {product.validationErrors?.length ? (
            product.validationErrors.map((message) => <p key={message}>• {message}</p>)
          ) : (
            <p className="muted">No validation issues.</p>
          )}
        </div>
      </div>

      <div style={{ height: 16 }} />

      <div className="grid grid-2">
        <div className="card">
          <h2>Competitor Prices</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Competitor</th>
                <th>Price</th>
                <th>Captured</th>
              </tr>
            </thead>
            <tbody>
              {product.competitorPrices?.map((item) => (
                <tr key={item.id}>
                  <td>{item.competitorName}</td>
                  <td>Rs. {Number(item.competitorPrice).toFixed(0)}</td>
                  <td>{new Date(item.capturedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h2>Alerts</h2>
          <table className="table">
            <tbody>
              {product.alerts?.map((alert) => (
                <tr key={alert.id}>
                  <td>
                    <span className={`badge ${alert.severity}`}>{alert.severity}</span>
                  </td>
                  <td>{alert.message}</td>
                </tr>
              ))}
              {!product.alerts?.length ? (
                <tr>
                  <td className="muted">No alerts for this product.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
