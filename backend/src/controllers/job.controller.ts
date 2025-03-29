import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { jobSchema } from '../validators/job.validator';

export const createJob = async (req: Request, res: Response) => {
  try {
    const validatedData = jobSchema.parse(req.body);
    
    const job = await prisma.job.create({
      data: validatedData
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create job', error });
  }
};

export const getJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch jobs', error });
  }
};

export const getJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        applications: true
      }
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch job', error });
  }
};

export const updateJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = jobSchema.parse(req.body);

    const job = await prisma.job.update({
      where: { id },
      data: validatedData
    });

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update job', error });
  }
};

export const deleteJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.job.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete job', error });
  }
};

export const applyForJob = async (req: Request, res: Response) => {
  try {
    const { id: jobId } = req.params;
    const userId = req.user.id;

    const application = await prisma.jobApplication.create({
      data: {
        userId,
        jobId
      }
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Failed to apply for job', error });
  }
};

export const getApplications = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const applications = await prisma.jobApplication.findMany({
      where: { userId },
      include: {
        job: true
      }
    });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applications', error });
  }
};

export const getRecommendedJobs = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        resume: true,
        preferences: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Simple recommendation based on job title and location
    const recommendedJobs = await prisma.job.findMany({
      where: {
        OR: [
          { title: { contains: user.jobTitle || '' } },
          { location: { contains: user.location || '' } }
        ]
      },
      take: 10
    });

    res.json(recommendedJobs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch recommended jobs', error });
  }
};