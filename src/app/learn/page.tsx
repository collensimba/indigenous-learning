"use client";
import { useState, useEffect } from "react";
import { BookOpen, Mic, MicOff, Home, BarChart3, Shield } from "lucide-react";

const LANGUAGES = ["Shona", "Ndebele", "Tonga"];
const GRADES = ["ECD", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7"];
const SUBJECTS = ["Mathematics", "Language Arts", "Science", "Social Studies", "Health"];

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isAI: boolean;
}

interface CachedContent {
  question: string;
  answer: string;
  timestamp: number;
}

export default function LearnPage() {
  const [language, setLanguage] = useState("Shona");
  const [grade, setGrade] = useState("Grade 3");
  const [subject, setSubject] = useState("Mathematics");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [cache, setCache] = useState<CachedContent[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    questionsAsked: 0,
    subjectsExplored: new Set<string>(),
    languagesUsed: new Set<string>(),
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Load cache from localStorage
    const saved = localStorage.getItem("dandaro_cache");
    if (saved) setCache(JSON.parse(saved));

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const saveToCache = (q: string, a: string) => {
    const newCache = [...cache, { question: q, answer: a, timestamp: Date.now() }];
    setCache(newCache);
    localStorage.setItem("dandaro_cache", JSON.stringify(newCache));
  };

  const findInCache = (q: string) => {
    return cache.find(c => c.question.toLowerCase() === q.toLowerCase());
  };

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "Shona" ? "sn" : language === "Ndebele" ? "nd" : "en";
      utterance.rate = 0.85;
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  const askQuestion = async () => {
    if (!question.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: question,
      timestamp: new Date(),
      isAI: false,
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    // Update session stats
    setSessionStats(prev => ({
      questionsAsked: prev.questionsAsked + 1,
      subjectsExplored: new Set([...prev.subjectsExplored, subject]),
      languagesUsed: new Set([...prev.languagesUsed, language]),
    }));

    // Check cache first (offline support)
    const cached = findInCache(question);
    if (cached || !isOnline) {
      const answer = cached?.answer || "Sorry, this content is not available offline. Please connect to the internet.";
      const aiMessage: Message = {
        role: "assistant",
        content: answer,
        timestamp: new Date(),
        isAI: true,
      };
      setMessages(prev => [...prev, aiMessage]);
      setLoading(false);
      setQuestion("");
      return;
    }

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, language, grade, subject }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      const aiMessage: Message = {
        role: "assistant",
        content: data.answer,
        timestamp: new Date(),
        isAI: true,
      };

      setMessages(prev => [...prev, aiMessage]);
      saveToCache(question, data.answer);
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, there was an error generating content. Please try again.",
        timestamp: new Date(),
        isAI: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setLoading(false);
    setQuestion("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="gradient-bg text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BookOpen size={28} />
            <h1 className="text-xl font-bold">Dandaro Learning</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`}>
              {isOnline ? "🟢 Online" : "🔴 Offline"}
            </span>
            <button onClick={() => setShowAnalytics(!showAnalytics)} className="flex items-center gap-1 bg-green-700 px-3 py-2 rounded-lg hover:bg-green-600 transition text-sm">
              <BarChart3 size={16} /> Analytics
            </button>
            <button onClick={() => window.location.href = "/"} className="flex items-center gap-1 bg-white text-green-700 px-3 py-2 rounded-lg hover:bg-green-50 transition text-sm font-semibold">
              <Home size={16} /> Home
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Panel */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white rounded-xl p-4 card-shadow">
            <h3 className="font-bold text-green-800 mb-4">⚙️ Settings</h3>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-gray-600 block mb-1">Language</label>
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 block mb-1">Grade Level</label>
                <select
                  value={grade}
                  onChange={e => setGrade(e.target.value)}
                  className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  {GRADES.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 block mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Ethical AI Badge */}
          <div className="bg-white rounded-xl p-4 card-shadow">
            <div className="flex items-center gap-2 text-green-700 mb-2">
              <Shield size={18} />
              <h3 className="font-bold text-sm">Ethical AI</h3>
            </div>
            <p className="text-xs text-gray-500">All content is AI-generated, age-appropriate, and curriculum-aligned. Content is moderated for safety.</p>
          </div>

          {/* Sample Questions */}
          <div className="bg-white rounded-xl p-4 card-shadow">
            <h3 className="font-bold text-green-800 mb-3 text-sm">💡 Sample Questions</h3>
            <div className="space-y-2">
              {[
                "Explain addition",
                "What is photosynthesis?",
                "Tell me a Shona proverb",
                "How do plants grow?",
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => setQuestion(q)}
                  className="w-full text-left text-xs bg-green-50 hover:bg-green-100 text-green-700 p-2 rounded-lg transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="md:col-span-3 flex flex-col">
          {/* Analytics Panel */}
          {showAnalytics && (
            <div className="bg-white rounded-xl p-4 card-shadow mb-4">
              <h3 className="font-bold text-green-800 mb-3">📊 Session Analytics</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-green-700">{sessionStats.questionsAsked}</p>
                  <p className="text-xs text-gray-500">Questions Asked</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-green-700">{sessionStats.subjectsExplored.size}</p>
                  <p className="text-xs text-gray-500">Subjects Explored</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-green-700">{sessionStats.languagesUsed.size}</p>
                  <p className="text-xs text-gray-500">Languages Used</p>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm text-gray-600">Subjects: {[...sessionStats.subjectsExplored].join(", ") || "None yet"}</p>
                <p className="text-sm text-gray-600">Languages: {[...sessionStats.languagesUsed].join(", ") || "None yet"}</p>
                <p className="text-sm text-gray-600">Cached lessons: {cache.length}</p>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="bg-white rounded-xl card-shadow flex-1 p-4 mb-4 min-h-96 max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                <BookOpen size={48} className="mb-4 text-green-300" />
                <p className="text-lg font-semibold text-green-700">Welcome to Dandaro!</p>
                <p className="text-sm mt-2">Select your language, grade, and subject,<br />then ask any question to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-xs md:max-w-md rounded-xl p-3 ${msg.role === "user" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-800"}`}>
                      {msg.isAI && (
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">🤖 AI Generated</span>
                          <button
                            onClick={() => speaking ? stopSpeaking() : speak(msg.content)}
                            className="ml-2 text-green-600 hover:text-green-800"
                          >
                            {speaking ? <MicOff size={14} /> : <Mic size={14} />}
                          </button>
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <p className="text-xs opacity-50 mt-1">{msg.timestamp.toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-xl p-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="bg-white rounded-xl p-4 card-shadow">
            <div className="flex gap-3">
              <input
                type="text"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => e.key === "Enter" && askQuestion()}
                placeholder={`Ask a ${subject} question in ${language}...`}
                className="flex-1 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
              />
              <button
                onClick={askQuestion}
                disabled={loading || !question.trim()}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Ask
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              🌍 {language} | 📚 {grade} | 📖 {subject} | {isOnline ? "☁️ Connected" : "💾 Using cached content"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}