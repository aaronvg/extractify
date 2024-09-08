"use server";

import { FormData } from "formdata-node";

export async function generatePattern(prompt: string): Promise<string> {
  const form = new FormData();
  form.append("prompt", prompt);
  form.append("designSystem", "html");
  form.append("styling", "customTailwind");
  form.append("shouldAwaitGenerations", "true");
  form.append("numberOfGenerations", "2");

  const options = {
    method: 'POST',
    headers: {
      'x-mp-api-key': process.env.MAGIC_PATTERNS_API_KEY || '',
      'Content-Type': 'multipart/form-data'
    },
    body: form
  };

  try {
    const response = await fetch('https://api.magicpatterns.com/api/pattern', options);
    const data = await response.json();

    if (data.url) {
      return data.url;
    } else {
      throw new Error('No URL returned from Magic Patterns API');
    }
  } catch (err) {
    console.error('Error generating pattern:', err);
    throw err;
  }
}
