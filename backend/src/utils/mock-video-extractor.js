const sampleProducts = [
  {
    sku: "VID-SHOE-101",
    title: "Running Shoes",
    description: "Lightweight breathable running shoes for daily training.",
    category: "Footwear",
    price: 2499,
    inventory: 42,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
  },
  {
    sku: "VID-BAG-204",
    title: "Laptop Backpack 28L",
    description: "Water resistant office backpack with padded laptop compartment.",
    category: "Bags",
    price: 1899,
    inventory: 18,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62"
  },
  {
    sku: "VID-WATCH-309",
    title: "Smart Fitness Watch",
    description: "Fitness watch with heart-rate tracking and long battery life.",
    category: "Electronics",
    price: 3999,
    inventory: 0,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
  },
  {
    sku: "VID-LAMP-412",
    title: "LED Desk Lamp",
    description: "Adjustable LED desk lamp with three brightness modes.",
    category: "Home",
    price: 999,
    inventory: 64,
    imageUrl: ""
  },
  {
    sku: "VID-BOTTLE-518",
    title: "Steel Water Bottle",
    description: "Insulated stainless steel bottle for hot and cold beverages.",
    category: "Kitchen",
    price: 799,
    inventory: 120,
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8"
  }
];

export async function extractProductsFromVideoMock() {
  await new Promise((resolve) => setTimeout(resolve, 1800));
  return sampleProducts.map((product) => ({
    ...product,
    rawData: {
      source: "mock_video_extraction",
      detectedSku: product.sku,
      detectedTitle: product.title,
      confidence: 0.86
    }
  }));
}
