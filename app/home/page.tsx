"use client"

import { Button } from "@/components/ui/button"
import { CalendarIcon, CheckCircle, FileText, LayoutDashboard, Users } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">IngeniusPlan: Your All-In-One Task Management Solution</h1>
          <p className="text-lg text-gray-600 mb-8">
            Streamline your workflow, boost productivity, and achieve your goals with our intuitive task management app.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/tasks">
              <Button className="bg-black text-white hover:bg-gray-800">Get Started</Button>
            </Link>
            <Button variant="outline">Learn More</Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <CheckCircle className="h-8 w-8 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Intuitive Task Management</h3>
              <p className="text-gray-600">Easily create, assign, and track tasks with our user-friendly interface.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <CalendarIcon className="h-8 w-8 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Integrated Calendar</h3>
              <p className="text-gray-600">
                Stay organized with our integrated calendar, ensuring you never miss a deadline.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <LayoutDashboard className="h-8 w-8 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Interactive Dashboard</h3>
              <p className="text-gray-600">
                Gain insights into your productivity with our interactive dashboard and reporting tools.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <FileText className="h-8 w-8 text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Project Documentation</h3>
              <p className="text-gray-600">
                Keep all your project-related documents in one place for easy access and collaboration.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Users className="h-8 w-8 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
              <p className="text-gray-600">
                Collaborate seamlessly with your team, assign tasks, and track progress together.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <CheckCircle className="h-8 w-8 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Goal Tracking</h3>
              <p className="text-gray-600">
                Set goals, track your progress, and celebrate your achievements with IngeniusPlan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">&copy; 2025 IngeniusPlan. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
