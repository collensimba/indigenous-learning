"use client";
import { useState } from "react";
import { BookOpen, Globe, Shield, Mic, BarChart3, Wifi } from "lucide-react";

export default function Home() {
  const [currentPage, setCurrentPage] = useState("home");

  if (currentPage === "learn") {
    window.location.href = "/learn";
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="gradient-bg text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BookOpen size={32} />
            <div>
              <h1 className="text-2xl font-bold">Dandaro</h1>
              <p className="text-green-200 text-sm">Indigenous Language Learning</p>
            </div>
          </div>
          <nav className="flex gap-4">
            <button
              onClick={() => window.location.href = "/learn"}
              className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition"
            >
              Start Learning
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-bg text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">
            Kudzidza Mutauro Wedu
          </h2>
          <p className="text-xl text-green-100 mb-4">Learning Our Language</p>
          <p className="text-lg text-green-200 mb-8 max-w-2xl mx-auto">
            AI-powered learning support for Shona, Ndebele, and Tonga — 
            aligned to the Zimbabwe MoPSE curriculum for Grades ECD to 7.
          </p>
          <button
            onClick={() => window.location.href = "/learn"}
            className="bg-white text-green-700 px-8 py-4 rounded-xl text-xl font-bold hover:bg-green-50 transition shadow-lg"
          >
            Begin Learning Now
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold text-center text-green-800 mb-12">
          Platform Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Globe size={40} className="text-green-600" />,
              title: "3 Indigenous Languages",
              desc: "Full support for Shona, Ndebele, and Tonga with curriculum-aligned content"
            },
            {
              icon: <Shield size={40} className="text-green-600" />,
              title: "Safe for Children",
              desc: "Content moderation and ethical AI safeguards protect young learners"
            },
            {
              icon: <Mic size={40} className="text-green-600" />,
              title: "Voice Support",
              desc: "Text-to-speech output for all AI-generated content in target languages"
            },
            {
              icon: <BarChart3 size={40} className="text-green-600" />,
              title: "Learning Analytics",
              desc: "Track progress across subjects and grades with detailed dashboards"
            },
            {
              icon: <Wifi size={40} className="text-green-600" />,
              title: "Offline Ready",
              desc: "Access cached content without internet connectivity"
            },
            {
              icon: <BookOpen size={40} className="text-green-600" />,
              title: "MoPSE Aligned",
              desc: "Content mapped to Zimbabwe's national curriculum framework"
            },
          ].map((feature, i) => (
            <div key={i} className="bg-white rounded-xl p-6 card-shadow hover:shadow-lg transition">
              <div className="mb-4">{feature.icon}</div>
              <h4 className="text-xl font-bold text-green-800 mb-2">{feature.title}</h4>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Languages */}
      <section className="bg-green-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-8">Supported Languages</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { lang: "Shona", greeting: "Mhoro!", speakers: "~10 million speakers" },
              { lang: "Ndebele", greeting: "Sawubona!", speakers: "~2 million speakers" },
              { lang: "Tonga", greeting: "Mwapona!", speakers: "~130,000 speakers" },
            ].map((l, i) => (
              <div key={i} className="bg-green-700 rounded-xl p-6">
                <h4 className="text-2xl font-bold mb-2">{l.lang}</h4>
                <p className="text-3xl mb-3">{l.greeting}</p>
                <p className="text-green-300 text-sm">{l.speakers}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-green-300 py-8 px-4 text-center">
        <p>© 2026 Dandaro — AI-Enabled Indigenous Language Learning System</p>
        <p className="text-sm mt-2">Aligned to Zimbabwe MoPSE Curriculum | Ethical AI Certified</p>
      </footer>
    </main>
    );
}