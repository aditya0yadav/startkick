import fs from "fs";
import pdf from "pdf-parse";
import Tesseract from "tesseract.js";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import sharp from "sharp";

const execPromise = promisify(exec);

async function extractTextFromImage(imagePath: string): Promise<string> {
    const { data: { text } } = await Tesseract.recognize(imagePath, "eng");
    return text.trim();
}

async function convertPDFToImages(pdfPath: string): Promise<string[]> {
    const tempDir = path.join(path.dirname(pdfPath), "temp_images_" + Date.now());
    fs.mkdirSync(tempDir, { recursive: true });
    const baseName = path.basename(pdfPath, ".pdf");
    console.log(baseName)
    const outputPath = path.join(tempDir, baseName);
    try {
        await execPromise(`pdftoppm -png "${pdfPath}" "${outputPath}"`);
        
        const files = fs.readdirSync(tempDir)
            .filter(file => file.startsWith(baseName) && file.endsWith(".png"))
            .map(file => path.join(tempDir, file));
        console.log(files)
        return files;
    } catch (error) {
        console.log(error)
    }
    return [];
}

export async function isTextBasedPDF(pdfPath: string): Promise<boolean> {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    return !!data.text.trim(); 
}

export async function ResumeExtractText(pdfPath: string): Promise<string> {
    const dataBuffer = fs.readFileSync(pdfPath);
    console.log(await isTextBasedPDF(pdfPath))
    
    if (await isTextBasedPDF(pdfPath)) {
        const buffer = await pdf(dataBuffer);
        console.log(buffer.text)
        return buffer.text;
    } else {
        try {
            const imageFiles = await convertPDFToImages(pdfPath);
            let combinedText = "";
            console.log(imageFiles)
            for (const imagePath of imageFiles) {
                const pageText = await extractTextFromImage(imagePath);
                combinedText += pageText + "\n\n";
            }
            for (const imagePath of imageFiles) {
                fs.unlinkSync(imagePath);
            }
            fs.rmdirSync(path.dirname(imageFiles[0]));
            console.log(combinedText.trim())
            return combinedText.trim();
        } catch (error) {
            throw error;
        }
    }
}