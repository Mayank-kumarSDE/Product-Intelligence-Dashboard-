import OpenAI from "openai";
import { env } from "../config/env.config.js";

// Helper to extract attributes from text (fallback rule engine)
function extractAttributesFallback(product) {
  const text = `${product.title} ${product.description || ""}`.toLowerCase();
  
  // Extract Brand
  let brand = product.brand || "";
  if (!brand) {
    if (text.includes("nike")) brand = "Nike";
    else if (text.includes("adidas")) brand = "Adidas";
    else if (text.includes("zara")) brand = "Zara";
    else if (text.includes("puma")) brand = "Puma";
    else brand = "Generic";
  }

  // Extract Color
  let color = product.color || "";
  if (!color) {
    if (text.includes("blue")) color = "Blue";
    else if (text.includes("red")) color = "Red";
    else if (text.includes("black")) color = "Black";
    else if (text.includes("white")) color = "White";
    else color = "Multicolor";
  }

  // Extract Material
  let material = product.material || "";
  if (!material) {
    if (text.includes("mesh")) material = "Mesh";
    else if (text.includes("leather")) material = "Leather";
    else if (text.includes("cotton")) material = "Cotton";
    else if (text.includes("steel")) material = "Stainless Steel";
    else material = "Premium Blend";
  }

  // Extract Size
  let size = product.size || "Standard";

  return { brand, color, material, size };
}

export async function enhanceTitle(product) {
  const fallbackAttrs = extractAttributesFallback(product);
  
  const fallbackResult = {
    enhancedTitle: `${fallbackAttrs.brand} ${fallbackAttrs.color} ${product.title} (${fallbackAttrs.material})`,
    extractedAttributes: {
      Brand: fallbackAttrs.brand,
      Color: fallbackAttrs.color,
      Material: fallbackAttrs.material,
      Size: fallbackAttrs.size
    },
    suggestedKeywords: ["trending", product.category?.toLowerCase() || "ecommerce", fallbackAttrs.material.toLowerCase()],
    enhancementReason: "Formatted to follow standard E-commerce SEO templates: [Brand] + [Color] + [Product Name] + [Material]."
  };

  if (!env.openaiApiKey) {
    return fallbackResult;
  }

  try {
    const client = new OpenAI({ apiKey: env.openaiApiKey });
    const response = await client.chat.completions.create({
      model: env.openaiModel || "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an e-commerce SEO expert. Analyze the product data and return a JSON object with: \n" +
            "1. 'enhancedTitle': A search-optimized title under 80 characters.\n" +
            "2. 'extractedAttributes': An object containing detected attributes (e.g. Brand, Color, Material, Size).\n" +
            "3. 'suggestedKeywords': An array of 3-5 trending keywords for this item.\n" +
            "4. 'enhancementReason': Brief reasoning (under 120 chars) for changes.\n" +
            "Respond ONLY with valid JSON."
        },
        {
          role: "user",
          content: JSON.stringify({
            title: product.title,
            brand: product.brand,
            category: product.category,
            description: product.description,
            color: product.color,
            size: product.size,
            material: product.material
          })
        }
      ],
      temperature: 0.3,
      max_tokens: 300,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0]?.message?.content?.trim());
    return {
      enhancedTitle: result.enhancedTitle || fallbackResult.enhancedTitle,
      extractedAttributes: result.extractedAttributes || fallbackResult.extractedAttributes,
      suggestedKeywords: result.suggestedKeywords || fallbackResult.suggestedKeywords,
      enhancementReason: result.enhancementReason || fallbackResult.enhancementReason
    };
  } catch (error) {
    console.error("OpenAI title enhancement failed, using fallback:", error);
    return fallbackResult;
  }
}
