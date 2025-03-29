// app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Tabs } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import PersonalInfo from "./components/PersonalInfo";
import EducationSection from "./components/EducationSection";
import WorkExperienceSection from "./components/WorkExperienceSection";
import ResumeSection from "./components/ResumeSection";
import { UserProfile } from "./types";

export default function ProfilePage() {
  const { user, token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: user?.name || "",
    email: user?.email || "",
    jobTitle: "",
    location: "",
    role: "USER",
    educations: [],
    workExperience: []
  });

  useEffect(() => {
    fetchUserProfile();
  }, [token]);

  const fetchUserProfile = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch profile: ${errorText}`);
      }

      const data = await response.json();
      setProfile({
        id: data.id,
        name: data.name,
        email: data.email,
        jobTitle: data.jobTitle || "",
        location: data.location || "",
        profileImage: data.profileImage,
        role: data.role,
        educations: data.educations || [],
        workExperience: data.workExperience || []
      });
    } catch (error) {
      console.error("Profile fetch error:", error);
      alert(`Could not fetch profile information: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profile.name,
          location: profile.location,
          jobTitle: profile.jobTitle,
          educations: profile.educations,
          workExperience: profile.workExperience
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Profile update failed: ${errorText}`);
      }

      const updatedProfile = await response.json();
      setProfile(prevProfile => ({
        ...prevProfile,
        ...updatedProfile
      }));
      setIsEditing(false);
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Profile update error:", error);
      alert(`Could not update profile: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-gray-500">Manage your professional profile</p>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <PersonalInfo 
          profile={profile} 
          setProfile={setProfile}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          loading={loading}
          updateProfile={updateProfile}
        />
        <EducationSection 
          profile={profile}
          setProfile={setProfile}
          isEditing={isEditing}
          loading={loading}
        />
        <WorkExperienceSection 
          profile={profile}
          setProfile={setProfile}
          isEditing={isEditing}
          loading={loading}
        />
        <ResumeSection 
          token={token}
          loading={loading}
          setLoading={setLoading}
        />
      </Tabs>
    </div>
  );
}