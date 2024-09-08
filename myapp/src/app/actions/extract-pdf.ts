"use server";
import { createStreamableValue, StreamableValue } from "ai/rsc";
import { b } from "@/baml_client";
import { BamlCtxManager, BamlStream, Image } from "@boundaryml/baml";
import { BamlRuntime } from "@boundaryml/baml";
import { makeStreamable, streamHelper } from "../utils/streamableObject";
import { BamlImage } from "@boundaryml/baml/native";

function parseBase64Prefix(base64: string): {
  mediaType: string;
  data: string;
} {
  const [prefix, data] = base64.split(",", 2);
  const mediaType = prefix.split(":")[1].split(";")[0];
  return { mediaType, data };
}

export async function GenerateBAMLSchema(content: string[], prompt?: string) {
  const imgs = content.map((c) => {
    const { mediaType, data } = parseBase64Prefix(c);
    return Image.fromBase64(mediaType, data);
  });
  const stream = b.stream.PDFGenerateBAMLSchema(imgs, prompt);
  return streamHelper(stream);
}

export async function ExtractWithSchema(content: string[], schema: string) {
  const imgs = content.map((c) => {
    const { mediaType, data } = parseBase64Prefix(c);
    return Image.fromBase64(mediaType, data);
  });
  return streamHelper(extractWithSchema(imgs, schema));
  
}

// Some stuff we gotta do to execute baml functions declared from a baml file at runtime
function extractWithSchema(content: BamlImage[], baml_schema: string) {
  const runtime = BamlRuntime.fromFiles(
    "baml_src",
    {
      "main.baml": baml_schema,
    },
    {
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ?? "",
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? "",
    }
  );

  const context = new BamlCtxManager(runtime);

  const rawStream = runtime.streamFunction(
    "Extract",
    {
      pdf: content[0],
    },
    () => { },
    context.cloneContext()
  );

  const stream = new BamlStream<any, any>(
    rawStream,
    (data: any) => {
      return data;
    },
    (data: any) => {
      return data;
    },
    context.cloneContext()
  );

  return stream;
}
