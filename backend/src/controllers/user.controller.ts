import { Request, Response } from "express";
import prisma from "../config/prisma";
import { hash } from "bcryptjs";
import { userProfileSchema } from "../validators/user.validator";
import { UPLOAD_DIR } from "../config/constants";
import fs from "fs";
import path from "path";
import { ResumeExtractTextWithoutModel } from "../function/resume.function";
import { calculateSimilarity, analyzeResume } from "../ml/processing";

interface EducationInput {
  id?: string;
  school: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
}

interface WorkExperienceInput {
  id?: string;
  companyName: string;
  jobTitle: string;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  description?: string;
}

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    console.log("Fetching profile for userId:", userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        jobTitle: true,
        location: true,
        profileImage: true,
        role: true,
        resume: {
          select: {
            id: true,
            filePath: true,
            parsedSkills: true,
            parsedExperience: true,
          },
        },
        preferences: true,
        educations: {
          orderBy: { endDate: 'desc' },
          select: {
            id: true,
            school: true,
            degree: true,
            fieldOfStudy: true,
            startDate: true,
            endDate: true,
          }
        },
        workExperience: {
          orderBy: { endDate: 'desc' },
          select: {
            id: true,
            companyName: true,
            jobTitle: true,
            startDate: true,
            endDate: true,
            description: true,
          }
        }
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch profile", error: String(error) });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    console.log("Update Profile Request Body:", req.body);
    console.log("User ID:", req.user.id);

    const userId = req.user.id;

    const { educations, workExperience, ...profileData } = req.body;

    const validProfileData = Object.fromEntries(
      Object.entries(userProfileSchema.parse(profileData)).filter(
        ([_, v]) => v !== undefined
      )
    );

    if (validProfileData.password) {
      validProfileData.password = await hash(validProfileData.password, 12);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: validProfileData,
      select: {
        id: true,
        name: true,
        email: true,
        jobTitle: true,
        location: true,
        profileImage: true,
        role: true,
      },
    });

    if (educations && educations.length > 0) {
      await prisma.education.deleteMany({ where: { userId } });
      
      await prisma.education.createMany({
        data: (educations as EducationInput[]).map((edu: EducationInput) => ({
          school: edu.school,
          degree: edu.degree,
          fieldOfStudy: edu.fieldOfStudy,
          startDate: edu.startDate ? new Date(edu.startDate) : null,
          endDate: edu.endDate ? new Date(edu.endDate) : null,
          userId,
        })),
      });
    }

    if (workExperience && workExperience.length > 0) {
      await prisma.workExperience.deleteMany({ where: { userId } });
      
      const validWorkExperiences = (workExperience as WorkExperienceInput[])
        .filter((work: WorkExperienceInput) => work.companyName && work.jobTitle);
      
      if (validWorkExperiences.length > 0) {
        await prisma.workExperience.createMany({
          data: validWorkExperiences.map((work: WorkExperienceInput) => ({
            companyName: work.companyName,
            jobTitle: work.jobTitle,
            startDate: work.startDate ? new Date(work.startDate) : null,
            endDate: work.endDate ? new Date(work.endDate) : null,
            description: work.description,
            userId,
          })),
        });
      }
    }

    const fullUpdatedProfile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        jobTitle: true,
        location: true,
        profileImage: true,
        role: true,
        educations: {
          orderBy: { endDate: 'desc' },
          select: {
            id: true,
            school: true,
            degree: true,
            fieldOfStudy: true,
            startDate: true,
            endDate: true,
          }
        },
        workExperience: {
          orderBy: { endDate: 'desc' },
          select: {
            id: true,
            companyName: true,
            jobTitle: true,
            startDate: true,
            endDate: true,
            description: true,
          }
        }
      },
    });

    console.log("Updated User:", fullUpdatedProfile);
    res.json(fullUpdatedProfile);
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      message: "Failed to update profile",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const uploadResume = async (req: Request, res: Response) => {
  try {
    console.log(req.file, req.user);
    const userId = req.user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
   
    const uploadsDir = path.join(UPLOAD_DIR, "resumes");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const existingResume = await prisma.resume.findUnique({
      where: { userId },
    });

    if (existingResume) {
      const oldFilePath = path.join(process.cwd(), existingResume.filePath);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }

      await prisma.resume.delete({
        where: { userId },
      });
    }

    const resume = await prisma.resume.create({
      data: {
        userId,
        filePath: path.join("uploads", "resumes", file.filename),
        parsedSkills: "",
        parsedExperience: "",
      },
    });

    res.status(201).json(resume);
  } catch (error) {
    res.status(500).json({ message: "Failed to upload resume", error });
  }
};

export const getResume = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const resume = await prisma.resume.findUnique({
      where: { userId },
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const filePath = path.join(process.cwd(), resume.filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Resume file not found" });
    }

    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch resume", error });
  }
};

export const uploadResumeAndJob = async (req: Request, res: Response) => {
  try {
    const jobDescription = req.body.jobDescription;
    
    if (!jobDescription) {
      return res.status(400).json({ message: "Job description is required" });
    }
    
    const file = req.file;
    const pathmain = file?.path;

    if (!file || !pathmain) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const textContent = await ResumeExtractTextWithoutModel(pathmain);
   
    const uploadsDir = path.join(UPLOAD_DIR, "resumes");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const rate = await analyzeResume(jobDescription, textContent);
    console.log(rate);
    res.status(201).json(rate);
  } catch (error) {
    console.error("Resume upload error:", error);
    res.status(500).json({ 
      message: "Failed to upload resume", 
      error: error instanceof Error ? error.message : String(error)
    });
  }
}