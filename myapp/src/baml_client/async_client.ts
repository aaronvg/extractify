/*************************************************************************************************

Welcome to Baml! To use this generated code, please run one of the following:

$ npm install @boundaryml/baml
$ yarn add @boundaryml/baml
$ pnpm add @boundaryml/baml

*************************************************************************************************/

// This file was generated by BAML: do not edit it. Instead, edit the BAML
// files and re-generate this code.
//
// tslint:disable
// @ts-nocheck
// biome-ignore format: autogenerated code
/* eslint-disable */
import { BamlRuntime, FunctionResult, BamlCtxManager, BamlStream, Image, ClientRegistry } from "@boundaryml/baml"
import {Item, Receipt} from "./types"
import TypeBuilder from "./type_builder"
import { DO_NOT_USE_DIRECTLY_UNLESS_YOU_KNOW_WHAT_YOURE_DOING_CTX, DO_NOT_USE_DIRECTLY_UNLESS_YOU_KNOW_WHAT_YOURE_DOING_RUNTIME } from "./globals"

export type RecursivePartialNull<T> = T extends object
  ? {
      [P in keyof T]?: RecursivePartialNull<T[P]>;
    }
  : T | null;

export class BamlAsyncClient {
  private runtime: BamlRuntime
  private ctx_manager: BamlCtxManager
  private stream_client: BamlStreamClient

  constructor(runtime: BamlRuntime, ctx_manager: BamlCtxManager) {
    this.runtime = runtime
    this.ctx_manager = ctx_manager
    this.stream_client = new BamlStreamClient(runtime, ctx_manager)
  }

  get stream() {
    return this.stream_client
  }  

  
  async ExtractReceipt(
      receipt: Image | string,
      __baml_options__?: { tb?: TypeBuilder, clientRegistry?: ClientRegistry }
  ): Promise<Receipt> {
    const raw = await this.runtime.callFunction(
      "ExtractReceipt",
      {
        "receipt": receipt
      },
      this.ctx_manager.cloneContext(),
      __baml_options__?.tb?.__tb(),
      __baml_options__?.clientRegistry,
    )
    return raw.parsed() as Receipt
  }
  
  async PDFGenerateBAMLSchema(
      pdf: Image[],prompt?: string | null,
      __baml_options__?: { tb?: TypeBuilder, clientRegistry?: ClientRegistry }
  ): Promise<string> {
    const raw = await this.runtime.callFunction(
      "PDFGenerateBAMLSchema",
      {
        "pdf": pdf,"prompt": prompt?? null
      },
      this.ctx_manager.cloneContext(),
      __baml_options__?.tb?.__tb(),
      __baml_options__?.clientRegistry,
    )
    return raw.parsed() as string
  }
  
}

class BamlStreamClient {
  constructor(private runtime: BamlRuntime, private ctx_manager: BamlCtxManager) {}

  
  ExtractReceipt(
      receipt: Image | string,
      __baml_options__?: { tb?: TypeBuilder, clientRegistry?: ClientRegistry }
  ): BamlStream<RecursivePartialNull<Receipt>, Receipt> {
    const raw = this.runtime.streamFunction(
      "ExtractReceipt",
      {
        "receipt": receipt
      },
      undefined,
      this.ctx_manager.cloneContext(),
      __baml_options__?.tb?.__tb(),
      __baml_options__?.clientRegistry,
    )
    return new BamlStream<RecursivePartialNull<Receipt>, Receipt>(
      raw,
      (a): a is RecursivePartialNull<Receipt> => a,
      (a): a is Receipt => a,
      this.ctx_manager.cloneContext(),
      __baml_options__?.tb?.__tb(),
    )
  }
  
  PDFGenerateBAMLSchema(
      pdf: Image[],prompt?: string | null,
      __baml_options__?: { tb?: TypeBuilder, clientRegistry?: ClientRegistry }
  ): BamlStream<RecursivePartialNull<string>, string> {
    const raw = this.runtime.streamFunction(
      "PDFGenerateBAMLSchema",
      {
        "pdf": pdf,"prompt": prompt ?? null
      },
      undefined,
      this.ctx_manager.cloneContext(),
      __baml_options__?.tb?.__tb(),
      __baml_options__?.clientRegistry,
    )
    return new BamlStream<RecursivePartialNull<string>, string>(
      raw,
      (a): a is RecursivePartialNull<string> => a,
      (a): a is string => a,
      this.ctx_manager.cloneContext(),
      __baml_options__?.tb?.__tb(),
    )
  }
  
}

export const b = new BamlAsyncClient(DO_NOT_USE_DIRECTLY_UNLESS_YOU_KNOW_WHAT_YOURE_DOING_RUNTIME, DO_NOT_USE_DIRECTLY_UNLESS_YOU_KNOW_WHAT_YOURE_DOING_CTX)