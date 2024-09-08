'use client'

import React, { useState, useEffect } from "react";
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
}

function PdfToImageConverter({ pdfUrl }: PdfToImageConverterProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        async function convertPdf() {
            const image = await convertPdfPageToImage(pdfUrl);
            setImageUrl(image);
        }

        convertPdf();
    }, [pdfUrl]);

    return (
        <div>
            {imageUrl ? (
                <img src={imageUrl} alt="Converted PDF page" />
            ) : (
                <p>Converting PDF to image...</p>
            )}
        </div>
    );
}

export default PdfToImageConverter;
