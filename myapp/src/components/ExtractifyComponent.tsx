"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { useStream } from "../app/hooks/useStream";
import {
  ExtractWithSchema,
  GenerateBAMLSchema,
} from "../app/actions/extract-pdf";
import { bamlBoilerPlate } from "../app/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeMirrorViewer } from "@/app/BAMLPreview";
import { unstable_noStore } from "next/cache";
import { ClipLoader } from "react-spinners";
import JSONGrid from "@redheadphone/react-json-grid";
import { useAtom, useSetAtom } from "jotai";
import { filesAtom } from "@/app/atoms";
import { Button } from "./ui/button";
import { PlayCircleIcon } from "lucide-react";

const ExtractifyComponent: React.FC<{
  content: string;
  prompt?: string;
}> = ({ content, prompt }) => {
  const [runAllError, setRunAllError] = useState<string | undefined>(undefined);
  const [bamlCode, setBamlCode] = useState<string>(bamlBoilerPlate);
  const [activeTab, setActiveTab] = useState<string>("schema");
  const [showRawJson, setShowRawJson] = useState<boolean>(false);
  const setFileAtom = useSetAtom(filesAtom);

  const {
    data: dataBaml,
    partialData: partialDataBaml,
    isLoading: isLoadingBaml,
    isComplete: isCompleteBaml,
    isError: isErrorBaml,
    error: errorBaml,
    mutate: mutateBaml,
  } = useStream(GenerateBAMLSchema);

  const {
    data: dataJson,
    partialData: partialDataJson,
    isLoading: isLoadingJson,
    isComplete: isCompleteJson,
    isError: isErrorJson,
    error: errorJson,
    mutate: mutateJson,
  } = useStream(ExtractWithSchema);

  const runAll = async () => {
    try {
      setRunAllError(undefined);
      console.log("mutatebaml");
      const data = await mutateBaml([content], prompt);
      console.log("bamlFile", data);

      console.log("mutatejson");
      if (!data) {
        throw new Error("Failed to generate BAML schema");
      }

      setActiveTab("data");
      console.log("content", content);
      const res = await mutateJson([content], bamlBoilerPlate + data);
      console.log("jsonOutput", res);
      setRunAllError(undefined); // Reset error if runAll succeeds
    } catch (error) {
      console.error("Error running runAll:", error);
      setRunAllError("Failed to run extraction. Please try again.");
    }
  };

  const runExtract = async () => {
    try {
      setActiveTab("data");
      setRunAllError(undefined);
      const data = await mutateJson([content], bamlCode);
      console.log("jsonOutput", data);
      setRunAllError(undefined); // Reset error if runAll succeeds
    } catch (error) {
      console.error("Error running runExtract:", error);
      setRunAllError("Failed to run extraction. Please try again.");
    }
  };

  useEffect(() => {
    if (dataBaml) {
      setBamlCode(bamlBoilerPlate + dataBaml);
      setFileAtom(bamlBoilerPlate + dataBaml);
    } else if (partialDataBaml) {
      setBamlCode(bamlBoilerPlate + partialDataBaml);
      setFileAtom(bamlBoilerPlate + partialDataBaml);
    }
  }, [dataBaml, partialDataBaml]);

  useEffect(() => {
    runAll();
  }, []);

  return (
    <div className="mb-4 bg-white rounded-lg p-3 shadow-sm">
      <p className="mb-2">{prompt}</p>
      {runAllError && <p className="text-red-500">{runAllError}</p>}
      <Tabs className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="schema">
            {isLoadingBaml && !(isCompleteBaml || isErrorBaml) && (
              <ClipLoader size={12} />
            )}{" "}
            🐑 BAML Schema{" "}
          </TabsTrigger>
          <TabsTrigger value="data">
            {isLoadingJson && !(isCompleteJson || isErrorJson) ? (
              <ClipLoader size={12} />
            ) : isCompleteJson ? (
              "🤯"
            ) : (
              ""
            )}{" "}
            Extractify!
          </TabsTrigger>
        </TabsList>
        <TabsContent value="schema">
          {!isLoadingBaml && bamlCode && (
            <Button onClick={runExtract} className="mb-2">
              <PlayCircleIcon className="mr-2" />
            </Button>
          )}
          <CodeMirrorViewer
            lang="baml"
            file_content={bamlCode}
            onChange={
              isCompleteBaml || isErrorBaml
                ? (val) => {
                    setBamlCode(val);
                    setFileAtom(val);
                  }
                : () => {}
            }
            shouldScrollDown={!isCompleteBaml && !isErrorBaml}
          />
        </TabsContent>
        <TabsContent value="data">
          <div className="mb-2">
            <Button onClick={() => setShowRawJson(!showRawJson)}>
              {showRawJson ? "Show JSON Grid" : "Show Raw JSON"}
            </Button>
          </div>
          <div className="demo-container w-full">
            {isLoadingJson && !(isCompleteJson || isErrorJson) && (
              <>
                <p>Extracting data using schema...</p>
              </>
            )}
            {showRawJson ? (
              <pre className="text-sm bg-gray-100 p-2 rounded">
                {JSON.stringify(partialDataJson ?? {}, null, 2)}
              </pre>
            ) : (
              <JSONGrid
                className="text-sm"
                theme="defaultLight"
                defaultExpandDepth={10}
                data={partialDataJson ?? {}}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const createRuntime = (
  wasm: typeof import("@gloo-ai/baml-schema-wasm-web"),
  envVars: Record<string, string>,
  project_files: Record<string, string>
) => {
  const project = wasm.WasmProject.new("baml_src", project_files);

  let rt = undefined;
  let diag = undefined;
  try {
    rt = project.runtime(envVars);
    diag = project.diagnostics(rt);
  } catch (e) {
    const WasmDiagnosticError = wasm.WasmDiagnosticError;
    if (e instanceof Error) {
      console.error(e.message);
    } else if (e instanceof WasmDiagnosticError) {
      diag = e;
    } else {
      console.error(e);
    }
  }

  return {
    project,
    runtime: rt,
    diagnostics: diag,
  };
};

function BAMLSchema() {
  // const [projectFiles, setProjectFiles] = useAtom(filesAtom);
  // const wasm = useAtomValue(wasmAtom);
  // const [diagnostics, setDiagnostics] = useAtom(diagnosticsAtom);
  // const createRuntimeCb = useAtomCallback(
  //   useCallback(
  //     (get, set, wasm: typeof import("@gloo-ai/baml-schema-wasm-web")) => {
  //       const {
  //         project,
  //         runtime,
  //         diagnostics: diags,
  //       } = createRuntime(
  //         wasm,
  //         { ANTHROPIC_API_KEY: "test", OPENAI_API_KEY: "test" },
  //         projectFiles
  //       );
  //       // set(projectAtom, project);
  //       // set(runtimesAtom, {
  //       //   last_successful_runtime: undefined,
  //       //   current_runtime: runtime,
  //       //   diagnostics: diags,
  //       // });
  //       // console.log("runtime created" + diagnostics?.errors());
  //       setDiagnostics(diags?.errors() ?? []);
  //     },
  //     [wasm, projectFiles, runtimesAtom, projectAtom]
  //   )
  // );
  // useEffect(() => {
  //   if (wasm) {
  //     createRuntimeCb(wasm);
  //   }
  // }, [wasm, JSON.stringify(projectFiles)]);
  // return (
  //   <>
  //     {/* {runtime && <>diagnostics ready</>} */}
  //     {/* {diagnostics && <> ({diagnostics.length} errors)</>} */}
  //   </>
  // );
}

export default ExtractifyComponent;
