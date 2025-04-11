'use client';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import heroImage from "@/assets/heroImage.jpg";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-grow bg-gradient-to-br from-green-50 to-white">
        <div className="container mx-auto px-4 py-16 flex flex-col-reverse md:flex-row items-center justify-between gap-10">

          {/* Left: Text content */}
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
              Welcome to <span className="text-green-600">Mess Connect</span>
            </h1>
            <p className="mt-4 text-gray-600 text-lg">
              Find local mess services near you, explore their menus, and leave reviews. Hassle-free daily meals, just a click away!
            </p>

            {/* Features */}
            <ul className="mt-6 space-y-3 text-gray-700">
              <li className="flex items-center"><CheckCircle className="text-green-500 mr-2" /> Discover nearby messes</li>
              <li className="flex items-center"><CheckCircle className="text-green-500 mr-2" /> Subscribe with ease</li>
              <li className="flex items-center"><CheckCircle className="text-green-500 mr-2" /> Rate and review experiences</li>
            </ul>

            {/* CTA Buttons */}
            <div className="mt-8 flex gap-4">
              <Button onClick={() => router.push("/register")} className="bg-green-600 text-white hover:bg-green-500 px-6 py-2">
                Get Started
              </Button>
              <Button onClick={() => router.push("/login")} variant="outline">
                Log In
              </Button>
            </div>
          </div>

          {/* Right: Image */}
          <div className="md:w-1/2">
            <Image
              src={heroImage}
              alt="Mess Connect Hero"
              width={500}
              height={500}
              className="rounded-xl shadow-xl object-cover"
            />
          </div>
        </div>
      </div>

    </div>
  );
}