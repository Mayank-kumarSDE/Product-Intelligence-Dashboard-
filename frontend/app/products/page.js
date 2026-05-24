import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { ProductFilters } from "@/components/ProductFilters";
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

      <ProductFilters products={products} />
    </AppShell>
  );
}
