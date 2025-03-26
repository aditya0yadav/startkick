"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Users, LineChart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-[#FFF9E6]">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-6xl font-bold tracking-tight text-gray-900 mb-6">
            Kickstart Your Career with{" "}
            <span className="text-[#FFB800]">StartKick</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            AI-powered job matching platform that connects talented professionals
            with their dream opportunities.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-[#FFB800] hover:bg-[#E6A600]">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <div className="animate-bounce">
              <ArrowRight className="h-6 w-6 transform rotate-90 text-gray-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Why Choose StartKick?
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<Brain className="h-12 w-12 text-[#FFB800]" />}
              title="AI Resume Matching"
              description="Our advanced AI analyzes your resume and matches you with the perfect job opportunities."
            />
            <FeatureCard
              icon={<LineChart className="h-12 w-12 text-[#FFB800]" />}
              title="Smart Recommendations"
              description="Get personalized job recommendations based on your skills and experience."
            />
            <FeatureCard
              icon={<Users className="h-12 w-12 text-[#FFB800]" />}
              title="HR Tools"
              description="Powerful tools for employers to find the best candidates using AI-driven matching."
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-gradient-to-t from-white to-[#FFF9E6]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Success Stories
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              image="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
              name="Sarah Johnson"
              role="Software Engineer"
              company="TechCorp"
              testimonial="StartKick helped me land my dream job within weeks. The AI matching was incredibly accurate!"
            />
            <TestimonialCard
              image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
              name="David Chen"
              role="Product Manager"
              company="InnovateCo"
              testimonial="The platform's AI recommendations were spot-on. I found the perfect role that matched my skills."
            />
            <TestimonialCard
              image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
              name="Emily Rodriguez"
              role="UX Designer"
              company="DesignHub"
              testimonial="StartKick's AI resume analysis helped me improve my profile and attract better opportunities."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-8 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow">
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function TestimonialCard({ image, name, role, company, testimonial }) {
  return (
    <div className="p-8 rounded-xl bg-white shadow-lg">
      <div className="flex items-center mb-6">
        <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-sm text-gray-600">
            {role} at {company}
          </p>
        </div>
      </div>
      <p className="text-gray-700 italic">&ldquo;{testimonial}&rdquo;</p>
    </div>
  );
}