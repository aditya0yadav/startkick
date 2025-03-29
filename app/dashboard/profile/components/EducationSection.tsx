// app/profile/components/EducationSection.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";
import { UserProfile, Education } from "../types";

interface EducationSectionProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  isEditing: boolean;
  loading: boolean;
}

export default function EducationSection({ 
  profile, 
  setProfile, 
  isEditing, 
  loading 
}: EducationSectionProps) {
  const [isAddingEducation, setIsAddingEducation] = useState(false);
  const [newEducation, setNewEducation] = useState<Education>({
    school: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    current: false
  });

  const addEducation = () => {
    if (!newEducation.school || !newEducation.degree || !newEducation.fieldOfStudy) {
      alert("Please fill in all required fields");
      return;
    }

    setProfile(prev => ({
      ...prev,
      educations: [...prev.educations, {
        ...newEducation,
        id: Date.now().toString()
      }]
    }));

    setNewEducation({
      school: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      current: false
    });
    setIsAddingEducation(false);
  };

  const removeEducation = (id: string) => {
    setProfile(prev => ({
      ...prev,
      educations: prev.educations.filter(edu => edu.id !== id)
    }));
  };

  return (
    <TabsContent value="education">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Education</h2>
          {isEditing && (
            <Button 
              variant="outline" 
              onClick={() => setIsAddingEducation(!isAddingEducation)}
              disabled={loading}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Education
            </Button>
          )}
        </div>

        {isAddingEducation && isEditing && (
          <div className="grid gap-4 md:grid-cols-2 mb-6 p-4 border rounded">
            <Input
              placeholder="School/University"
              value={newEducation.school}
              onChange={(e) => setNewEducation({...newEducation, school: e.target.value})}
            />
            <Input
              placeholder="Degree"
              value={newEducation.degree}
              onChange={(e) => setNewEducation({...newEducation, degree: e.target.value})}
            />
            <Input
              placeholder="Field of Study"
              value={newEducation.fieldOfStudy}
              onChange={(e) => setNewEducation({...newEducation, fieldOfStudy: e.target.value})}
            />
            <Input
              type="date"
              value={newEducation.startDate}
              onChange={(e) => setNewEducation({...newEducation, startDate: e.target.value})}
            />
            {!newEducation.current && (
              <Input
                type="date"
                value={newEducation.endDate}
                onChange={(e) => setNewEducation({...newEducation, endDate: e.target.value})}
              />
            )}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={newEducation.current}
                onChange={(e) => setNewEducation({...newEducation, current: e.target.checked})}
                className="mr-2"
              />
              <label>Currently Studying</label>
            </div>
            <Button onClick={addEducation} disabled={loading}>Save Education</Button>
          </div>
        )}

        {profile.educations.map((edu) => (
          <div key={edu.id} className="flex justify-between items-center p-4 border-b">
            <div>
              <h3 className="font-semibold">{edu.school}</h3>
              <p>{edu.degree} in {edu.fieldOfStudy}</p>
              <p>{edu.startDate} - {edu.current ? 'Present' : edu.endDate}</p>
            </div>
            {isEditing && (
              <Button 
                variant="destructive" 
                size="icon" 
                onClick={() => removeEducation(edu.id!)}
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </Card>
    </TabsContent>
  );
}