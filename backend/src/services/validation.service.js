export function validateProduct(product, competitorPrices = []) {
  const issues = [];
  const price = product.price !== null && product.price !== undefined ? Number(product.price) : null;
  const mrp = product.mrp !== null && product.mrp !== undefined ? Number(product.mrp) : null;

  // 1. HIGH Severity checks
  if (!product.title || product.title.trim().length === 0) {
    issues.push({
      severity: "HIGH",
      type: "missing_title",
      message: "Title is missing."
    });
  }

  if (price === null || isNaN(price) || price <= 0) {
    issues.push({
      severity: "HIGH",
      type: "invalid_price",
      message: "Price must be positive and numeric."
    });
  }

  if (mrp !== null && price !== null && mrp < price) {
    issues.push({
      severity: "HIGH",
      type: "mrp_lower",
      message: "MRP cannot be lower than the selling price."
    });
  }

  if (!product.imageUrl || product.imageUrl.trim().length === 0) {
    issues.push({
      severity: "HIGH",
      type: "missing_image",
      message: "Product image is missing."
    });
  }

  if (product.duplicateSku) {
    issues.push({
      severity: "HIGH",
      type: "duplicate_sku",
      message: "Duplicate SKU code found."
    });
  }

  // 2. MEDIUM Severity checks
  if (product.title && product.title.trim().length > 0 && product.title.trim().length < 8) {
    issues.push({
      severity: "MEDIUM",
      type: "short_title",
      message: "Title is very short (< 8 characters)."
    });
  }

  if (!product.brand || product.brand.trim().length === 0) {
    issues.push({
      severity: "MEDIUM",
      type: "missing_brand",
      message: "Brand is missing."
    });
  }

  const missingAttrs = [];
  if (!product.color || product.color.trim().length === 0) missingAttrs.push("color");
  if (!product.size || product.size.trim().length === 0) missingAttrs.push("size");
  if (!product.material || product.material.trim().length === 0) missingAttrs.push("material");

  if (missingAttrs.length > 0) {
    issues.push({
      severity: "MEDIUM",
      type: "missing_attributes",
      message: `Missing important attributes: ${missingAttrs.join(", ")}.`
    });
  }

  if (product.imageUrl && product.imageUrl.trim().length > 0) {
    const isUrl = product.imageUrl.startsWith("http://") || product.imageUrl.startsWith("https://");
    if (!isUrl) {
      issues.push({
        severity: "MEDIUM",
        type: "broken_image_url",
        message: "Image URL is broken or invalid."
      });
    }
  }

  // 3. LOW Severity checks
  if (!product.description || product.description.trim().length < 20) {
    issues.push({
      severity: "LOW",
      type: "weak_description",
      message: "Description is too weak (< 20 characters)."
    });
  }

  if (product.availability === "out_of_stock" || product.inventory === 0) {
    issues.push({
      severity: "LOW",
      type: "out_of_stock",
      message: "Product is out of stock."
    });
  }

  // Determine overall status
  let status = "valid";
  if (issues.some((i) => i.severity === "HIGH")) {
    status = "invalid";
  } else if (issues.some((i) => i.severity === "MEDIUM" || i.severity === "LOW")) {
    status = "warning";
  }

  return {
    status,
    issues
  };
}
