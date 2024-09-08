import { atom, useAtomValue, useSetAtom } from "jotai";
import { unwrap } from "jotai/utils";
import React, { useEffect, useRef, type PropsWithChildren } from "react";


import { BAML, theme } from "@boundaryml/baml-lezer";
import CodeMirror, {
  Compartment,
  EditorView,
  Extension,
  ReactCodeMirrorRef,
} from "@uiw/react-codemirror";
import { type Diagnostic, linter } from "@codemirror/lint";
import {   diagnosticsAtom } from "./atoms";
import { atomStore } from "@/components/Jotai";

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
  file_content,
  onChange,
  shouldScrollDown,
}: {
  lang: string;
  file_content: string;
  onChange?: (value: string) => void;
  shouldScrollDown: boolean;
}) => {
  const containerRef = useRef<ReactCodeMirrorRef | null>({}); // New ref for the container

  useEffect(() => {
    // const interval = setInterval(() => {
    if (containerRef.current?.view?.contentDOM) {
      const line = containerRef.current.view.state.doc.lineAt(
        containerRef.current.view.state.doc.length
      );
      console.log("line", containerRef.current.view.state.doc);
      if (line) {
        console.log("scrolling down", line);
        if (shouldScrollDown) {
          containerRef.current.view?.dispatch({
            selection: { anchor: line.from, head: undefined },
            scrollIntoView: true,
          });
        }
      }

      // // Scroll to the bottom of the container
      // containerRef.current.contentDOM.scrollIntoView({
      //   behavior: "smooth",
      // });
    }
    // }, 1000); // Adjust the interval time (in milliseconds) as needed

    // return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [file_content, containerRef, shouldScrollDown]);


  return (
    <div className="w-full max-h-[700px] h-full overflow-y-auto rounded-md">
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
          value={file_content}
          onChange={onChange}
          extensions={extensions}
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          theme={theme}
          className="text-xs rounded-md"
          height="100%"
          width="100%"
          maxWidth="100%"
          ref={containerRef}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
};
