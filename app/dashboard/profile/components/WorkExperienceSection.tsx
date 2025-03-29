// app/profile/components/WorkExperienceSection.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";
import { UserProfile, WorkExperience } from "../types";

interface WorkExperienceSectionProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  isEditing: boolean;
  loading: boolean;
}

export default function WorkExperienceSection({ 
  profile, 
  setProfile, 
  isEditing, 
  loading 
}: WorkExperienceSectionProps) {
  const [isAddingWorkExp, setIsAddingWorkExp] = useState(false);
  const [newWorkExp, setNewWorkExp] = useState<WorkExperience>({
    company: '',
    title: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });

  const addWorkExperience = () => {
    if (!newWorkExp.company || !newWorkExp.title) {
      alert("Please fill in all required fields");
      return;
    }

    setProfile(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, {
        ...newWorkExp,
        id: Date.now().toString()
      }]
    }));
    console.log(profile)

    setNewWorkExp({
      company: '',
      title: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    });
    setIsAddingWorkExp(false);
  };

  const removeWorkExperience = (id: string) => {
    setProfile(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter(exp => exp.id !== id)
    }));
  };

  return (
    <TabsContent value="experience">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Work Experience</h2>
          {isEditing && (
            <Button 
              variant="outline" 
              onClick={() => setIsAddingWorkExp(!isAddingWorkExp)}
              disabled={loading}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Work Experience
            </Button>
          )}
        </div>

        {isAddingWorkExp && isEditing && (
          <div className="grid gap-4 md:grid-cols-2 mb-6 p-4 border rounded">
            <Input
              placeholder="Company"
              value={newWorkExp.company}
              onChange={(e) => setNewWorkExp({...newWorkExp, company: e.target.value})}
            />
            <Input
              placeholder="Job Title"
              value={newWorkExp.title}
              onChange={(e) => setNewWorkExp({...newWorkExp, title: e.target.value})}
            />
            <Input
              placeholder="Location"
              value={newWorkExp.location}
              onChange={(e) => setNewWorkExp({...newWorkExp, location: e.target.value})}
            />
            <Input
              type="date"
              value={newWorkExp.startDate}
              onChange={(e) => setNewWorkExp({...newWorkExp, startDate: e.target.value})}
            />
            {!newWorkExp.current && (
              <Input
                type="date"
                value={newWorkExp.endDate}
                onChange={(e) => setNewWorkExp({...newWorkExp, endDate: e.target.value})}
              />
            )}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={newWorkExp.current}
                onChange={(e) => setNewWorkExp({...newWorkExp, current: e.target.checked})}
                className="mr-2"
              />
              <label>Currently Working</label>
            </div>
            <textarea
              placeholder="Job Description"
              value={newWorkExp.description}
              onChange={(e) => setNewWorkExp({...newWorkExp, description: e.target.value})}
              className="col-span-2 p-2 border rounded"
            />
            <Button onClick={addWorkExperience} disabled={loading}>Save Work Experience</Button>
          </div>
        )}

        {profile.workExperience.map((exp) => (
          <div key={exp.id} className="flex justify-between items-center p-4 border-b">
            <div>
              <h3 className="font-semibold">{exp.title} at {exp.company}</h3>
              <p>{exp.location}</p>
              <p>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
              {exp.description && <p className="text-gray-600 mt-2">{exp.description}</p>}
            </div>
            {isEditing && (
              <Button 
                variant="destructive" 
                size="icon" 
                onClick={() => removeWorkExperience(exp.id!)}
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