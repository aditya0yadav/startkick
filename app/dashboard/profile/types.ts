// app/profile/types.ts
export interface Education {
    id?: string;
    school: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
  }
  
  export interface WorkExperience {
    id?: string;
    company: string;
    title: string;
    location: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    description?: string;
  }
  
  export interface UserProfile {
    id?: string;
    name: string;
    email: string;
    jobTitle?: string;
    location?: string;
    profileImage?: string;
    role: string;
    educations: Education[];
    workExperience: WorkExperience[];
  }