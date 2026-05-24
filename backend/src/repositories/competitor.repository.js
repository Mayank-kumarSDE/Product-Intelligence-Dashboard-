import { CompetitorPrice } from "../db/models/index.js";

export async function replaceCompetitorPrices(productId, prices) {
  await CompetitorPrice.destroy({ where: { productId } });
  return CompetitorPrice.bulkCreate(prices.map((price) => ({ ...price, productId })));
}
