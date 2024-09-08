'use client'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useStream } from "../app/hooks/useStream";
import {
    ExtractWithSchema,
    GenerateBAMLSchema
  } from "../app/actions/extract-pdf";
import { bamlBoilerPlate } from "../app/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeMirrorViewer } from '@/app/BAMLPreview';
import { unstable_noStore } from 'next/cache';
import { ClipLoader } from 'react-spinners'

const ExtractifyComponent: React.FC<{
    content: string,
    prompt?: string
}> = ({content, prompt}) => {
    const [runAllError, setRunAllError] = useState<string | undefined>(undefined);
    const [bamlCode, setBamlCode] = useState<string>(bamlBoilerPlate);
    const [activeTab, setActiveTab] = useState<string>("schema");

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
          const res = await mutateJson([content], bamlBoilerPlate + data);
          console.log("jsonOutput", res);
          setRunAllError(undefined); // Reset error if runAll succeeds
        } catch (error) {
          console.error("Error running runAll:", error);
          setRunAllError("Failed to run extraction. Please try again.");
        }
      };

      useEffect(() => {
        if (dataBaml) {
          setBamlCode(bamlBoilerPlate + dataBaml);
        } else if (partialDataBaml) {
          setBamlCode(bamlBoilerPlate + partialDataBaml);
        }
      }, [dataBaml, partialDataBaml]);



      useEffect(() => {
        runAll();
      }, []);

      return <div className="mb-4 bg-white rounded-lg p-3 shadow-sm">
      <p className="mb-2">{prompt}</p>
      {runAllError && <p className="text-red-500">{runAllError}</p>}
      <Tabs className="w-full" value={activeTab} onValueChange={setActiveTab} >
        <TabsList>
          <TabsTrigger value="schema">{ isLoadingBaml && !(isCompleteBaml || isErrorBaml) && <ClipLoader size={12} />} 🐑 BAML Schema </TabsTrigger>
          <TabsTrigger value="data">{ isLoadingJson && !(isCompleteJson || isErrorJson) ? <ClipLoader size={12} /> : "🤯" } Extractify!</TabsTrigger>
        </TabsList>
        <TabsContent value="schema">
          <CodeMirrorViewer lang="baml" file_content={
            bamlCode
          } onChange={isCompleteBaml || isErrorBaml ? setBamlCode : () => {}} />
        </TabsContent>
        <TabsContent value="data">
          <pre>{
              isCompleteJson ? JSON.stringify(dataJson, null, 2) :
              JSON.stringify(partialDataJson, null, 2)
            }</pre>
        </TabsContent>
      </Tabs>
    </div>

}


export default ExtractifyComponent