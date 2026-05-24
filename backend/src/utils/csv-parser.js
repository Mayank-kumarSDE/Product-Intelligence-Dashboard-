import { parse } from "csv-parse/sync";

function getValue(row, aliases, fallback = "") {
  for (const alias of aliases) {
    if (row[alias] !== undefined && row[alias] !== "") {
      return row[alias];
    }
  }
  return fallback;
}

export function parseProductCsv(buffer) {
  const csv = buffer.toString("utf-8");
  const rows = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  return rows.map((row, index) => ({
    sku: getValue(row, ["sku", "SKU", "product_id", "productId", "id"], `CSV-${index + 1}`),
    title: getValue(row, ["title", "name", "product_name", "productName", "listing_title"]),
    description: getValue(row, ["description", "desc", "product_description", "details"]),
    category: getValue(row, ["category", "type", "department"], "General"),
    price: Number(getValue(row, ["price", "flipkart_price", "selling_price", "mrp", "amount"], 0)),
    inventory: Number(getValue(row, ["inventory", "stock", "qty", "quantity", "available_units"], 0)),
    imageUrl: getValue(row, ["image_url", "imageUrl", "image", "thumbnail", "photo_url"]),
    rawData: row
  }));
}
