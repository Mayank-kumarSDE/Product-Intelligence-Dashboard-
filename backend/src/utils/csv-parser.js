import { parse } from "csv-parse/sync";

export function parseProductCsv(buffer) {
  const csv = buffer.toString("utf-8");
  const rows = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  return rows.map((row, index) => ({
    sku: row.sku || row.SKU || `CSV-${index + 1}`,
    title: row.title || row.name || "",
    description: row.description || "",
    category: row.category || "General",
    price: Number(row.price || 0),
    inventory: Number(row.inventory || row.stock || 0),
    imageUrl: row.image_url || row.imageUrl || ""
  }));
}
