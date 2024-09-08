import type { WasmDiagnosticError, WasmError, WasmProject, WasmRuntime } from '@gloo-ai/baml-schema-wasm-web'
import { atom, createStore } from "jotai";
export const atomStore = createStore()

export const filesAtom = atom<Record<string, string>>({})

export const diagnosticsAtom = atom<WasmError[]>([])