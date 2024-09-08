import { atom } from "jotai";
import { unwrap } from "jotai/utils";
import React, { useRef, type PropsWithChildren } from "react";

import { StreamLanguage } from "@codemirror/language";

import { BAML, theme } from "@boundaryml/baml-lezer";
import CodeMirror, {
  Compartment,
  EditorView,
  Extension,
  ReactCodeMirrorRef,
} from "@uiw/react-codemirror";
import { type Diagnostic, linter } from "@codemirror/lint";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { atomStore, diagnosticsAtom, filesAtom } from "./atoms";

const wasmAtomAsync = atom(async () => {
  const wasm = await import("@gloo-ai/baml-schema-wasm-web/baml_schema_build");
  return wasm;
});

export const wasmAtom = unwrap(wasmAtomAsync);

// TODO: need to wire up diagnostics to runtime.
function makeLinter() {
  return linter(
    (_view) => {
      console.log("running linter");
      const diagnosticErrors = atomStore.get(diagnosticsAtom);

      console.log("diagnosticErrors", diagnosticErrors);

      return (
        diagnosticErrors.map((err): Diagnostic => {
          return {
            from: err.start_ch,
            to: err.start_ch === err.end_ch ? err.end_ch + 1 : err.end_ch,
            message: err.message,
            severity: err.type === "warning" ? "warning" : "error",
            source: "baml",
            markClass:
              err.type === "error"
                ? "decoration-wavy decoration-red-500 text-red-450 stroke-blue-500"
                : "",
          };
        }) ?? []
      );
    },
    { delay: 200 }
  );
}

const comparment = new Compartment();
const extensions: Extension[] = [
  BAML(),
  EditorView.lineWrapping,
  comparment.of(makeLinter()),
];

export const CodeMirrorViewer = ({
  lang,
}: {
  lang: string;
  shouldScrollDown?: boolean;
}) => {
  const [file, setFileContent] = useAtom(filesAtom);
  const containerRef = useRef<ReactCodeMirrorRef | null>({});
  return (
    <div className="w-full max-h-[700px] h-full overflow-y-clip rounded-md">
      <div
        className="relative"
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <CodeMirror
          key={lang}
          id={lang}
          value={Object.values(file)[0]}
          onChange={(value) => {
            setFileContent({
              "baml_src/main.baml": value,
            });
          }}
          extensions={extensions}
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          theme={theme}
          className="text-xs rounded-md"
          height="100%"
          width="100%"
          maxWidth="100%"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
};
