import type { WasmDiagnosticError, WasmError, WasmProject, WasmRuntime } from '@gloo-ai/baml-schema-wasm-web'
import { atom, createStore } from "jotai";

import { unwrap } from 'jotai/utils';

const wasmAtomAsync = atom(async () => {
    const wasm = await import("@gloo-ai/baml-schema-wasm-web/baml_schema_build");
    return wasm;
});

const wasmAtom = unwrap(wasmAtomAsync);

export const filesAtom = atom<string>("")

export const diagnosticsAtom = atom((get) => {
    const wasm = get(wasmAtom)
    const files = get(filesAtom)
    console.log("project", files)

    if (wasm) {
        const project = wasm.WasmProject.new("./", {
            "./baml_src/main.baml": files
        });
        try {
            const rt = project.runtime({})
            return project.diagnostics(rt).errors()
        } catch (e) {
            const WasmDiagnosticError = wasm.WasmDiagnosticError
            if (e instanceof Error) {
                console.error(e.message)
            } else if (e instanceof WasmDiagnosticError) {
                return e.errors()
            } else {
                console.error(e)
            }
        }
    }
    return []
}

);