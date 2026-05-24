import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Info, Sparkles, Tag, TrendingDown, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CompetitorPriceUploader } from "@/components/CompetitorPriceUploader";
import { ProductActions } from "@/components/ProductActions";
import { EnhanceTitleNow } from "@/components/EnhanceTitleNow";
import { api } from "@/lib/api";

function getPriceMetrics(price, competitorPrices = []) {
  if (!competitorPrices.length || !price) {
    return { lowest: 0, highest: 0, average: 0, gap: 0, percentDiff: 0, recommendation: "No competitor data available" };
  }

  const numericPrices = competitorPrices.map((c) => Number(c.competitorPrice)).filter((p) => p > 0);
  if (!numericPrices.length) {
    return { lowest: 0, highest: 0, average: 0, gap: 0, percentDiff: 0, recommendation: "No competitor data available" };
  }

  const lowest = Math.min(...numericPrices);
  const highest = Math.max(...numericPrices);
  const average = numericPrices.reduce((sum, p) => sum + p, 0) / numericPrices.length;

  const gap = price - lowest;
  const percentDiff = Math.round((gap / lowest) * 100);

  let recommendation = "";
  let recStatus = "";

  if (price > lowest * 1.10) {
    recommendation = `Reduce Flipkart price by Rs. ${Math.round(gap)} to match lowest competitor (${percentDiff}% above lowest).`;
    recStatus = "danger";
  } else if (price > lowest) {
    recommendation = `Flipkart price is slightly high. Match competitor lowest (Rs. ${lowest}) for maximum conversion.`;
    recStatus = "warning";
  } else {
    recommendation = "Flipkart price is highly competitive. Maintain current price.";
    recStatus = "success";
  }

  return { lowest, highest, average, gap, percentDiff, recommendation, recStatus };
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  let product;

  try {
    product = await api(`/api/products/${id}`);
  } catch {
    notFound();
  }

  const metrics = getPriceMetrics(Number(product.price), product.competitorPrices);

  // Group validation issues by severity
  const validationIssues = product.validationErrors || [];
  const highIssues = validationIssues.filter((i) => i.severity === "HIGH");
  const medIssues = validationIssues.filter((i) => i.severity === "MEDIUM");
  const lowIssues = validationIssues.filter((i) => i.severity === "LOW");

  return (
    <AppShell>
      <div style={{ marginBottom: 16 }}>
        <Link href="/products" className="muted" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14 }}>
          <ArrowLeft size={16} /> Back to Products List
        </Link>
      </div>

      <div className="section-title">
        <div>
          <h1>{product.enhancedTitle || product.title}</h1>
          <p className="muted" style={{ marginTop: 4 }}>
            SKU: <strong>{product.sku}</strong> · Category: <strong>{product.category || "General"}</strong> · Brand: <strong>{product.brand || "Unbranded"}</strong>
          </p>
        </div>
        <ProductActions product={product} productId={product.id} />
      </div>

      <div className="grid grid-2" style={{ marginBottom: 20 }}>
        {/* Catalogue Info Card */}
        <div className="card stack">
          <h2>Catalogue Properties</h2>
          
          <div className="grid grid-2" style={{ gap: 12, fontSize: 14 }}>
            <div>
              <span className="muted" style={{ display: "block", fontSize: 12 }}>Selling Price (Flipkart)</span>
              <strong>Rs. {Number(product.price).toFixed(0)}</strong>
            </div>
            <div>
              <span className="muted" style={{ display: "block", fontSize: 12 }}>MRP (Max Retail Price)</span>
              <strong>{product.mrp ? `Rs. ${Number(product.mrp).toFixed(0)}` : "Not specified"}</strong>
            </div>
            <div>
              <span className="muted" style={{ display: "block", fontSize: 12 }}>Availability</span>
              <span className={`badge ${product.availability === "in_stock" ? "completed" : "failed"}`}>
                {product.availability === "in_stock" ? "In Stock" : "Out of Stock"}
              </span>
            </div>
            <div>
              <span className="muted" style={{ display: "block", fontSize: 12 }}>Inventory Level</span>
              <strong>{product.inventory} units</strong>
            </div>
          </div>

          <hr style={{ border: 0, borderTop: "1px solid var(--line)", margin: "10px 0" }} />

          <div style={{ fontSize: 14 }}>
            <span className="muted" style={{ display: "block", fontSize: 12, marginBottom: 4 }}>Product Attributes</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              <span className="badge secondary" style={{ textTransform: "none" }}>Color: {product.color || "N/A"}</span>
              <span className="badge secondary" style={{ textTransform: "none" }}>Size: {product.size || "N/A"}</span>
              <span className="badge secondary" style={{ textTransform: "none" }}>Material: {product.material || "N/A"}</span>
            </div>
          </div>

          <div style={{ fontSize: 14 }}>
            <span className="muted" style={{ display: "block", fontSize: 12, marginBottom: 4 }}>Product Description</span>
            <p style={{ margin: 0, lineHeight: 1.4 }}>{product.description || "No description provided."}</p>
          </div>

          {product.imageUrl ? (
            <div>
              <span className="muted" style={{ display: "block", fontSize: 12, marginBottom: 4 }}>Product Image Preview</span>
              <img src={product.imageUrl} alt={product.title} style={{ maxWidth: 120, height: "auto", borderRadius: 6, border: "1px solid var(--line)" }} />
            </div>
          ) : null}
        </div>

        {/* Validation and Issue severity groupings */}
        <div className="card stack">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>Catalogue Quality Status</h2>
            <span className={`badge ${product.validationStatus}`}>{product.validationStatus}</span>
          </div>

          {validationIssues.length === 0 ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--good)", padding: "16px 0" }}>
              <CheckCircle size={24} />
              <span>Great job! This product listing meets all quality requirements.</span>
            </div>
          ) : (
            <div className="stack" style={{ gap: 14, paddingTop: 10 }}>
              {highIssues.length > 0 && (
                <div>
                  <h4 style={{ color: "var(--bad)", margin: "0 0 6px 0", display: "flex", alignItems: "center", gap: 6 }}>
                    <AlertCircle size={16} /> HIGH Severity Issues ({highIssues.length})
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, lineHeight: 1.4 }}>
                    {highIssues.map((issue, idx) => (
                      <li key={idx} style={{ color: "var(--bad)" }}>{issue.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              {medIssues.length > 0 && (
                <div>
                  <h4 style={{ color: "var(--warn)", margin: "0 0 6px 0", display: "flex", alignItems: "center", gap: 6 }}>
                    <AlertCircle size={16} /> MEDIUM Severity Issues ({medIssues.length})
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, lineHeight: 1.4 }}>
                    {medIssues.map((issue, idx) => (
                      <li key={idx} style={{ color: "var(--warn)" }}>{issue.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              {lowIssues.length > 0 && (
                <div>
                  <h4 style={{ color: "var(--brand)", margin: "0 0 6px 0", display: "flex", alignItems: "center", gap: 6 }}>
                    <Info size={16} /> LOW Severity Issues ({lowIssues.length})
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, lineHeight: 1.4 }}>
                    {lowIssues.map((issue, idx) => (
                      <li key={idx} style={{ color: "var(--text)" }}>{issue.message}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Competitor price gap analysis */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h2>Competitor Price Dashboard</h2>
        <p className="muted" style={{ marginBottom: 16 }}>Detailed pricing gap analysis against competitor stores.</p>

        {metrics.lowest > 0 ? (
          <div>
            <div className="grid grid-4" style={{ marginBottom: 16 }}>
              <div style={{ background: "var(--bg)", padding: 12, borderRadius: 6 }}>
                <span className="muted" style={{ fontSize: 12 }}>Lowest Price</span>
                <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>Rs. {metrics.lowest.toFixed(0)}</div>
              </div>
              <div style={{ background: "var(--bg)", padding: 12, borderRadius: 6 }}>
                <span className="muted" style={{ fontSize: 12 }}>Average Price</span>
                <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>Rs. {metrics.average.toFixed(0)}</div>
              </div>
              <div style={{ background: "var(--bg)", padding: 12, borderRadius: 6 }}>
                <span className="muted" style={{ fontSize: 12 }}>Price Gap (Flipkart)</span>
                <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4, color: metrics.gap > 0 ? "var(--bad)" : "var(--good)" }}>
                  {metrics.gap > 0 ? `+Rs. ${metrics.gap.toFixed(0)}` : `Rs. ${metrics.gap.toFixed(0)}`}
                </div>
              </div>
              <div style={{ background: "var(--bg)", padding: 12, borderRadius: 6 }}>
                <span className="muted" style={{ fontSize: 12 }}>Gap Percentage</span>
                <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4, color: metrics.percentDiff > 0 ? "var(--bad)" : "var(--good)" }}>
                  {metrics.percentDiff > 0 ? `+${metrics.percentDiff}%` : `${metrics.percentDiff}%`}
                </div>
              </div>
            </div>

            <div 
              style={{ 
                padding: 14, 
                borderRadius: 8, 
                background: metrics.recStatus === "danger" ? "#fee4e2" : metrics.recStatus === "warning" ? "#fef3c7" : "#dcfce7",
                color: metrics.recStatus === "danger" ? "var(--bad)" : metrics.recStatus === "warning" ? "var(--warn)" : "var(--good)",
                display: "flex", 
                alignItems: "center", 
                gap: 10,
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 20
              }}
            >
              <TrendingDown size={20} />
              <span>Recommended Action: {metrics.recommendation}</span>
            </div>
          </div>
        ) : null}

        <table className="table">
          <thead>
            <tr>
              <th>Competitor Platform</th>
              <th>Competitor Price</th>
              <th>Currency</th>
              <th>Last Checked At</th>
            </tr>
          </thead>
          <tbody>
            {product.competitorPrices?.map((item) => (
              <tr key={item.id}>
                <td style={{ fontWeight: 600 }}>{item.competitorName}</td>
                <td>Rs. {Number(item.competitorPrice).toFixed(0)}</td>
                <td>{item.currency || "INR"}</td>
                <td>{new Date(item.capturedAt).toLocaleString()}</td>
              </tr>
            ))}
            {!product.competitorPrices?.length ? (
              <tr>
                <td colSpan="4" className="muted">No competitor prices found. Upload a competitor price feed CSV or refresh prices.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <CompetitorPriceUploader sku={product.sku} />

      {/* AI Enhanced Title suggestions table */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Sparkles size={20} style={{ color: "var(--brand)" }} />
          <h2>AI Enhanced Title Suggestions</h2>
        </div>

        {product.enhancedTitle ? (
          <div style={{ border: "1px solid var(--line)", borderRadius: 8, overflow: "hidden" }}>
            <table className="table" style={{ margin: 0 }}>
              <tbody>
                <tr>
                  <td style={{ width: "20%", fontWeight: 600, background: "var(--bg)" }}>Original Title</td>
                  <td>{product.title}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, background: "var(--bg)" }}>Extracted Attributes</td>
                  <td>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {product.extractedAttributes && Object.keys(product.extractedAttributes).length > 0 ? (
                        Object.entries(product.extractedAttributes).map(([key, val]) => (
                          <span key={key} className="badge secondary" style={{ textTransform: "none", fontSize: 11 }}>
                            <strong>{key}:</strong> {val}
                          </span>
                        ))
                      ) : (
                        <span className="muted">No attributes extracted</span>
                      )}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, background: "var(--bg)" }}>Suggested Keywords</td>
                  <td>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {product.suggestedKeywords && product.suggestedKeywords.length > 0 ? (
                        product.suggestedKeywords.map((kw, idx) => (
                          <span key={idx} style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#e0f2fe", color: "#0369a1", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4 }}>
                            <Tag size={10} /> {kw}
                          </span>
                        ))
                      ) : (
                        <span className="muted">No keywords generated</span>
                      )}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, background: "var(--bg)" }}>Enhanced Title</td>
                  <td style={{ fontSize: 16, fontWeight: 700, color: "var(--brand-dark)" }}>{product.enhancedTitle}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, background: "var(--bg)" }}>Improvement Reason</td>
                  <td style={{ fontStyle: "italic", color: "var(--muted)" }}>{product.enhancementReason || "No explanation provided"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <p className="muted" style={{ marginBottom: 12 }}>No enhanced title has been generated yet for this product.</p>
              <EnhanceTitleNow productId={product.id} />
          </div>
        )}
      </div>

    </AppShell>
  );
}
