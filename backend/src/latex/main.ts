import gemini from "../ml/gemini";
const { geminiLatexCode } = gemini;

export async function CreateLatexCode(content: string): Promise<any> {
    try {
        const [introduction, workExperience, education, otherSections] = await Promise.all([
            IntroductionLatexCode(content),
            WorkExperienceLatex(content),
            EducationLatexCode(content),
            OtherLatexCode(content)
        ]);

        const fullLatexCode = `
            \\documentclass{article}
            \\usepackage{geometry}
            \\geometry{a4paper, margin=1in}
            \\begin{document}

            ${introduction}

            ${workExperience}

            ${education}

            ${otherSections}

            \\end{document}
        `;

        return fullLatexCode;
    } catch (error) {
        console.error("Error generating full LaTeX code:", error);
    }
}

export async function WorkExperienceLatex(content: string): Promise<any> {
    try {
        const systemMessage = `
            Convert the 'work_experience' section from structured resume data into LaTeX format.
            Each job entry should include company name, job title, start date, end date, and job description.
        `;
        return await geminiLatexCode(systemMessage + content);
    } catch (error) {
        console.error("Error generating LaTeX for Work Experience:", error);
    }
}

export async function EducationLatexCode(content: string): Promise<any> {
    try {
        const systemMessage = `
            Convert the 'education' section from structured resume data into LaTeX format.
            Each entry should include college name, degree, field of study, start date, and end date.
        `;
        return await geminiLatexCode(systemMessage + content);
    } catch (error) {
        console.error("Error generating LaTeX for Education:", error);
    }
}

export async function IntroductionLatexCode(content: string): Promise<any> {
    try {
        const systemMessage = `
            Convert the 'introduction' section from structured resume data into LaTeX format.
            Include the name, role, contact information, and a professional summary.
        `;
        return await geminiLatexCode(systemMessage + content);
    } catch (error) {
        console.error("Error generating LaTeX for Introduction:", error);
    }
}

export async function OtherLatexCode(content: string): Promise<any> {
    try {
        const systemMessage = `
            Convert additional sections such as 'skills', 'certifications', 'projects', 'publications', 
            'volunteer experience', 'awards', 'languages', and 'interests' into LaTeX format.
        `;
        return await geminiLatexCode(systemMessage + content);
    } catch (error) {
        console.error("Error generating LaTeX for Other Sections:", error);
    }
}
