"use client";

import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FileText, Building2, CheckCircle2 } from "lucide-react";

const data = [
  { name: "Mon", applications: 4 },
  { name: "Tue", applications: 3 },
  { name: "Wed", applications: 7 },
  { name: "Thu", applications: 5 },
  { name: "Fri", applications: 6 },
  { name: "Sat", applications: 2 },
  { name: "Sun", applications: 1 },
];

const stats = [
  {
    title: "Applications",
    value: "28",
    description: "This week",
    icon: FileText,
    trend: "+12.5%",
    color: "text-blue-600",
  },
  {
    title: "Interviews",
    value: "5",
    description: "Scheduled",
    icon: Building2,
    trend: "+25%",
    color: "text-green-600",
  },
  {
    title: "Profile Match",
    value: "85%",
    description: "Average",
    icon: CheckCircle2,
    trend: "+5%",
    color: "text-purple-600",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500">Welcome back to StartKick</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map(({ title, value, description, icon: Icon, trend, color }) => (
          <Card key={title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold">{value}</p>
                  <p className="ml-2 text-sm text-gray-600">{description}</p>
                </div>
                <p className="text-sm text-green-600">{trend}</p>
              </div>
              <Icon className={`h-8 w-8 ${color}`} />
            </div>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card className="p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Application Activity</h2>
          <p className="text-sm text-gray-600">Past 7 days</p>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="applications" fill="#FFB800" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
