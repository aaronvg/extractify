"use client";

import { ExtractifyChat } from "@/components/extractify-chat"
import { useState, useEffect } from "react";
import {
  ExtractWithSchema,
  GenerateBAMLSchema
} from "./actions/extract-pdf";
import { useStream } from "./hooks/useStream";
import { useAtom } from "jotai";
import { filesAtom } from "./atoms";
import { bamlBoilerPlate } from "./constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeMirrorViewer } from "./BAMLPreview";

export default function Home() {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ExtractifyChat />
    </div>
  )
}
