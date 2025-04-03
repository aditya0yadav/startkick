import fs from "fs";
import pdf from "pdf-parse";
import Tesseract from "tesseract.js";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import gemini from "../ml/gemini";
const { geminiResumeFormatter } = gemini;
import { CreateLatexCode } from "../latex/main";

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


export async function CreateResumeWithLatex(content: string): Promise<string | null> {
    try {
        const latexCode = await CreateLatexCode(content);
        if (!latexCode) throw new Error("Failed to generate LaTeX code");

        console.log("Generated LaTeX Code:\n", latexCode);
        return latexCode;
    } catch (error) {
        console.error("Error in CreateResumeWithLatex:", error);
        return null;
    }
}


export async function ResumeExtractTextWithModel(pdfPath: string): Promise<string> {
    const dataBuffer = fs.readFileSync(pdfPath);
    console.log(await isTextBasedPDF(pdfPath))
    
    if (await isTextBasedPDF(pdfPath)) {
        const buffer = await pdf(dataBuffer);
        const rtr = await getContentFromModel(buffer.text);
        return rtr
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

export async function ResumeExtractTextWithoutModel(pdfPath: string): Promise<string> {
    const dataBuffer = fs.readFileSync(pdfPath);
    console.log(await isTextBasedPDF(pdfPath))
    
    if (await isTextBasedPDF(pdfPath)) {
        const buffer = await pdf(dataBuffer);
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


export async function getContentFromModel(content: string): Promise<any> {
    const systemPrompt = `
        {
            "system": {
                "role": "You are an AI system that extracts and structures resume content.",
                "task": "Transform the provided textual content into a structured format without omitting any details.",
                "output_format": {
                    "name": "<Extracted Name>",
                    "contact": {
                        "email": "<Extracted Email>",
                        "phone": "<Extracted Phone>",
                        "linkedin": "<LinkedIn Profile>",
                        "website": "<Personal Website or Portfolio>"
                    },
                    "role": "<Extracted Role>",
                    "summary": "<Brief Professional Summary>",
                    "skills": [
                        "<Skill 1>",
                        "<Skill 2>",
                        "<Skill 3>"
                    ],
                    "work_experience": [
                        {
                            "company": "<Company Name>",
                            "position": "<Job Title>",
                            "location": "<Company Location>",
                            "start_date": "<Start Date>",
                            "end_date": "<End Date or 'Present'>",
                            "experience_details": [
                                "<Work Experience Detail 1>",
                                "<Work Experience Detail 2>",
                                "<Work Experience Detail 3>"
                            ]
                        }
                    ],
                    "education": [
                        {
                            "college_name": "<College Name>",
                            "degree": "<Degree Name>",
                            "field_of_study": "<Field of Study>",
                            "start_date": "<Start Date>",
                            "end_date": "<End Date or 'Ongoing'>",
                            "gpa": "<GPA (if available)>"
                        }
                    ],
                    "projects": [
                        {
                            "project_name": "<Project Name>",
                            "description": "<Project Description>",
                            "technologies": ["<Technology 1>", "<Technology 2>"],
                            "link": "<Project URL>"
                        }
                    ],
                    "certifications": [
                        {
                            "certification_name": "<Certification Name>",
                            "issuing_organization": "<Issuing Organization>",
                            "issue_date": "<Issue Date>",
                            "expiration_date": "<Expiration Date or 'Ongoing'>",
                            "details": "<Certification Details>"
                        }
                    ],
                    "publications": [
                        {
                            "title": "<Publication Title>",
                            "journal": "<Journal or Conference Name>",
                            "publication_date": "<Publication Date>",
                            "link": "<Publication URL>"
                        }
                    ],
                    "volunteer_experience": [
                        {
                            "organization": "<Organization Name>",
                            "role": "<Volunteer Role>",
                            "start_date": "<Start Date>",
                            "end_date": "<End Date or 'Ongoing'>",
                            "details": "<Details about the Volunteer Work>"
                        }
                    ],
                    "awards": [
                        {
                            "award_name": "<Award Name>",
                            "organization": "<Awarding Organization>",
                            "year": "<Award Year>",
                            "details": "<Award Details>"
                        }
                    ],
                    "languages": [
                        {
                            "language": "<Language>",
                            "proficiency": "<Proficiency Level>"
                        }
                    ],
                    "interests": [
                        "<Interest 1>",
                        "<Interest 2>"
                    ]
                }
            }
        }
    `;
    const retr = await geminiResumeFormatter(systemPrompt + content);
    console.log(await CreateLatexCode(retr));

    return retr;
}
