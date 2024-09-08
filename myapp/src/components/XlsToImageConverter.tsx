'use client'

import React from 'react';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';

async function convertXlsToImage(fileUrl: string): Promise<string | null> {
    try {
        const response = await fetch(fileUrl);
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const html = XLSX.utils.sheet_to_html(firstSheet);
        
        const div = document.createElement('div');
        div.innerHTML = html;
        document.body.appendChild(div);
        
        const canvas = await html2canvas(div);
        document.body.removeChild(div);
        
        return canvas.toDataURL('image/png');
    } catch (error) {
        console.error("Error converting XLS to image:", error);
        return null;
    }
}

interface XlsToImageConverterProps {
    xlsUrl: string;
    onConversionComplete: (imageUrl: string | null) => void;
}

function XlsToImageConverter({ xlsUrl, onConversionComplete }: XlsToImageConverterProps) {
    React.useEffect(() => {
        async function convertXls() {
            const image = await convertXlsToImage(xlsUrl);
            onConversionComplete(image);
        }

        convertXls();
    }, [xlsUrl, onConversionComplete]);

    return null;
}

export default XlsToImageConverter;