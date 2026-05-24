export function validateProduct(product, competitorPrices = []) {
  const errors = [];
  const warnings = [];
  const price = Number(product.price);

  if (!product.title || product.title.trim().length < 8) {
    errors.push("Title is missing or too short");
  }

  if (!product.description || product.description.trim().length < 20) {
    warnings.push("Description is short");
  }

  if (!price || price <= 0) {
    errors.push("Price must be greater than zero");
  }

  if (product.inventory === undefined || Number(product.inventory) < 0) {
    errors.push("Inventory is missing or invalid");
  }

  if (!product.imageUrl) {
    warnings.push("Product image is missing");
  }

  if (competitorPrices.length && price > 0) {
    const average =
      competitorPrices.reduce((sum, item) => sum + Number(item.competitorPrice), 0) /
      competitorPrices.length;

    if (price > average * 1.15) {
      warnings.push("Product price is more than 15% above competitor average");
    }
  }

  if (errors.length) {
    return { status: "invalid", messages: [...errors, ...warnings] };
  }

  if (warnings.length) {
    return { status: "warning", messages: warnings };
  }

  return { status: "valid", messages: [] };
}
