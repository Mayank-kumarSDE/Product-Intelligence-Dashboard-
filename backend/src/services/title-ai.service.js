import OpenAI from "openai";
import { env } from "../config/env.config.js";

export async function enhanceTitle(product) {
  if (!env.openaiApiKey) {
    return `${product.title} - ${product.category} | Premium Quality`;
  }

  const client = new OpenAI({ apiKey: env.openaiApiKey });
  const response = await client.chat.completions.create({
    model: env.openaiModel,
    messages: [
      {
        role: "system",
        content:
          "You write concise, SEO-friendly ecommerce product titles. Return only one title under 90 characters."
      },
      {
        role: "user",
        content: `Title: ${product.title}\nCategory: ${product.category}\nDescription: ${product.description}`
      }
    ],
    temperature: 0.4,
    max_tokens: 40
  });

  return response.choices[0]?.message?.content?.trim() || product.title;
}
