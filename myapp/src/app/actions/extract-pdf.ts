"use server";
import { createStreamableValue, StreamableValue } from "ai/rsc";

export async function pdfGenerateBamlSchema(base64: string, prompt?: string) {
  const objectStream = createStreamableValue<Partial<string>, any>(
    "starting.."
  );

  return { object: objectStream.value };
}

export async function extractWithSchema(base64: string, baml_schema: string) {
  const objectStream = createStreamableValue<Partial<string>, any>("{}");


  return { object: objectStream.value };
}