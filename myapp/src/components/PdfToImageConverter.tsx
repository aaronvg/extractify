'use client'

import React from "react";
import { pdfjs } from 'react-pdf';

// Set the worker source to a CDN URL
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

async function convertPdfPageToImage(pdfUrl: string, pageNumber = 1) {
    try {
        const pdf = await pdfjs.getDocument(pdfUrl).promise;
        const page = await pdf.getPage(pageNumber);
        const scale = 1.5;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: context!,
            viewport: viewport,
        };
        await page.render(renderContext).promise;

        return canvas.toDataURL("image/png");
    } catch (error) {
        console.error("Error converting PDF to image:", error);
        return null;
    }
}

interface PdfToImageConverterProps {
    pdfUrl: string;
    onConversionComplete: (imageUrl: string | null) => void;
}

function PdfToImageConverter({ pdfUrl, onConversionComplete }: PdfToImageConverterProps) {
    React.useEffect(() => {
        async function convertPdf() {
            const image = await convertPdfPageToImage(pdfUrl);
            onConversionComplete(image);
        }

        convertPdf();
    }, [pdfUrl, onConversionComplete]);

    return null;
}

export default PdfToImageConverter;
