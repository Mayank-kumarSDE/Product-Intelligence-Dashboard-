const competitors = ["Amazon", "Flipkart", "Myntra", "Meesho", "Snapdeal"];

export function generateCompetitorPrices(product) {
  const basePrice = Number(product.price);

  return competitors.map((name, index) => {
    const movement = [-0.18, -0.1, -0.04, 0.08, 0.16][index];
    const noise = Math.random() * 0.08 - 0.04;
    const competitorPrice = Math.max(99, Math.round(basePrice * (1 + movement + noise)));

    return {
      competitorName: name,
      competitorPrice,
      url: `https://example.com/${name.toLowerCase()}/${product.sku}`,
      capturedAt: new Date()
    };
  });
}
