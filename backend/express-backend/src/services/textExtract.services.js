import PDFParser from "pdf2json";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pptxTextParser = require('pptx-text-parser');

export const textRead = async (file) => {
    const buffer = file.buffer;
    const fileType = file.mimetype;

    try {
        if (fileType === "application/pdf") {
            return new Promise((resolve, reject) => {
                const pdfParser = new PDFParser();
                
                pdfParser.on("pdfParser_dataReady", (pdfData) => {
                    try {
                        const text = decodeURIComponent(pdfData.Pages
                            .map(page => page.Texts
                                .map(text => text.R
                                    .map(r => r.T)
                                    .join(' '))
                                .join(' '))
                            .join('\n'));
                        
                        if (!text.trim()) {
                            reject(new Error("Could not extract text from PDF"));
                        }
                        resolve(text.trim());
                    } catch (error) {
                        reject(new Error(`PDF parsing error: ${error.message}`));
                    }
                });

                pdfParser.on("pdfParser_dataError", (error) => {
                    reject(new Error(`PDF parsing error: ${error.message}`));
                });

                pdfParser.parseBuffer(buffer);
            });
        }
        else if (fileType === "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
            try {
                // Pass buffer directly to pptxTextParser
                const text = await pptxTextParser(buffer);
                
                if (!text.trim()) {
                    throw new Error("Could not extract text from PPTX");
                }
                
                return text.trim();
            } catch (error) {
                throw new Error(`PPTX parsing error: ${error.message}`);
            }
        }
        throw new Error("Unsupported File Type Provided");
    } catch (error) {
        throw new Error(`Error extracting text: ${error.message}`);
    }
};