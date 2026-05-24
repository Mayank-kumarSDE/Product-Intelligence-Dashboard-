import { parse } from "csv-parse/sync";

function getValue(row, aliases, fallback = "") {
  for (const alias of aliases) {
    if (row[alias] !== undefined && row[alias] !== null && row[alias] !== "") {
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

  return rows.map((row, index) => {
    const rawPrice = getValue(row, ["price", "flipkart_price", "selling_price", "amount"]);
    const rawMrp = getValue(row, ["mrp", "max_retail_price"]);
    const rawInventory = getValue(row, ["inventory", "stock", "qty", "quantity", "available_units"]);

    const price = isNaN(Number(rawPrice)) || rawPrice === "" ? null : Number(rawPrice);
    const mrp = isNaN(Number(rawMrp)) || rawMrp === "" ? null : Number(rawMrp);
    const inventory = isNaN(Number(rawInventory)) || rawInventory === "" ? 0 : Number(rawInventory);

    return {
      sku: getValue(row, ["sku_id", "sku", "SKU", "product_id", "productId", "id"], `CSV-${index + 1}`),
      title: getValue(row, ["product_title", "title", "name", "product_name", "productName", "listing_title"]),
      brand: getValue(row, ["brand", "manufacturer"]),
      category: getValue(row, ["category", "type", "department"], "General"),
      price,
      mrp,
      inventory,
      availability: getValue(row, ["availability", "stock_status"], "in_stock"),
      color: getValue(row, ["color", "colour"]),
      size: getValue(row, ["size"]),
      material: getValue(row, ["material"]),
      imageUrl: getValue(row, ["image_url", "imageUrl", "image", "thumbnail", "photo_url"]),
      description: getValue(row, ["description", "desc", "product_description", "details"]),
      rawData: row
    };
  });
}

export function parseCompetitorCsv(buffer) {
  const csv = buffer.toString("utf-8");
  const rows = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  return rows.map((row) => {
    const rawPrice = getValue(row, ["competitor_price", "competitorPrice", "price"]);
    const competitorPrice = isNaN(Number(rawPrice)) || rawPrice === "" ? null : Number(rawPrice);

    return {
      sku: getValue(row, ["sku_id", "sku", "SKU", "productId"]),
      productName: getValue(row, ["product_name", "productName", "title"]),
      competitorName: getValue(row, ["platform", "competitorName", "competitor_name"]),
      competitorPrice,
      url: getValue(row, ["competitor_url", "url"]),
      currency: getValue(row, ["currency"], "INR"),
      capturedAt: getValue(row, ["last_checked_at", "lastCheckedAt", "capturedAt"])
        ? new Date(getValue(row, ["last_checked_at", "lastCheckedAt", "capturedAt"]))
        : new Date()
    };
  });
}
