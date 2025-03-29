// app/profile/components/ResumeSection.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

interface ResumeSectionProps {
  token: string | null;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ResumeSection({ token, loading, setLoading }: ResumeSectionProps) {
  const [resume, setResume] = useState<File | null>(null);
  const [resumeUploadStatus, setResumeUploadStatus] = useState<string | null>(null);

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(file.type)) {
        alert("Please upload a PDF or Word document");
        return;
      }

      if (file.size > maxSize) {
        alert("Resume must be less than 10MB");
        return;
      }

      setResume(file);
      setResumeUploadStatus(null);
    }
  };

  const uploadResume = async () => {
    if (!resume || !token) return;

    const formData = new FormData();
    formData.append('resume', resume);

    setLoading(true);
    setResumeUploadStatus(null);

    try {
      const response = await fetch("http://localhost:5000/api/users/resume", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Resume upload failed: ${errorText}`);
      }

      setResumeUploadStatus("Resume uploaded successfully");
      setResume(null);
    } catch (error) {
      console.error("Resume upload error:", error);
      setResumeUploadStatus(`Could not upload resume: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TabsContent value="resume">
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-6">Resume</h2>
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
            className="hidden"
            id="resume-upload"
          />
          <label
            htmlFor="resume-upload"
            className="cursor-pointer text-blue-500 hover:underline"
          >
            {resume ? resume.name : "Upload Resume"}
          </label>
          {resume && (
            <Button 
              onClick={uploadResume} 
              disabled={loading}
              className="ml-4 mt-4"
            >
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading</>
              ) : (
                "Upload Resume"
              )}
            </Button>
          )}
          {resumeUploadStatus && (
            <p 
              className={`mt-2 ${
                resumeUploadStatus.includes('failed') 
                  ? 'text-red-500' 
                  : 'text-green-500'
              }`}
            >
              {resumeUploadStatus}
            </p>
          )}
        </div>
      </Card>
    </TabsContent>
  );
}