'use client'

import React from 'react';
import mammoth from "mammoth";
import html2canvas from 'html2canvas';

async function convertDocxToImage(fileUrl: string): Promise<string | null> {
    try {
        const response = await fetch(fileUrl);
        const arrayBuffer = await response.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        
        const div = document.createElement('div');
        div.innerHTML = result.value;
        document.body.appendChild(div);
        
        const canvas = await html2canvas(div);
        document.body.removeChild(div);
        
        return canvas.toDataURL('image/png');
    } catch (error) {
        console.error("Error converting DOCX to image:", error);
        return null;
    }
}

interface DocxToImageConverterProps {
    docxUrl: string;
    onConversionComplete: (imageUrl: string | null) => void;
}

function DocxToImageConverter({ docxUrl, onConversionComplete }: DocxToImageConverterProps) {
    React.useEffect(() => {
        async function convertDocx() {
            const image = await convertDocxToImage(docxUrl);
            onConversionComplete(image);
        }

        convertDocx();
    }, [docxUrl, onConversionComplete]);

    return null;
}

export default DocxToImageConverter;