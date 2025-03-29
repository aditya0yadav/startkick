// app/profile/components/PersonalInfo.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Upload, Loader2 } from "lucide-react";
import { UserProfile } from "../types";
import { useState } from "react";

interface PersonalInfoProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  updateProfile: () => Promise<void>;
}

export default function PersonalInfo({ 
  profile, 
  setProfile, 
  isEditing, 
  setIsEditing, 
  loading, 
  updateProfile 
}: PersonalInfoProps) {
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        alert("Please upload a JPEG, PNG, or GIF image");
        return;
      }

      if (file.size > maxSize) {
        alert("Image must be less than 5MB");
        return;
      }

      setProfilePicture(file);
    }
  };

  return (
    <>
      <TabsList>
        <TabsTrigger value="personal">Personal Info</TabsTrigger>
        <TabsTrigger value="education">Education</TabsTrigger>
        <TabsTrigger value="experience">Work Experience</TabsTrigger>
        <TabsTrigger value="resume">Resume</TabsTrigger>
      </TabsList>

      <TabsContent value="personal">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <Button
              onClick={isEditing ? updateProfile : () => setIsEditing(true)}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
          </div>

          <div className="flex items-center space-x-6 mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center relative">
              {profilePicture ? (
                <img
                  src={URL.createObjectURL(profilePicture)}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 text-gray-400" />
              )}
              {isEditing && (
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleProfilePictureChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              )}
            </div>
            {isEditing && (
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Change Photo
              </Button>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={profile.email} disabled />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Job Title</Label>
              <Input
                value={profile.jobTitle}
                onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>
        </Card>
      </TabsContent>
    </>
  );
}