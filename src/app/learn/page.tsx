"use client";
import { useState, useEffect } from "react";
import { BookOpen, Mic, MicOff, Home, BarChart3, Shield, Send, Wifi, WifiOff } from "lucide-react";

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
  const [sessionStats, setSessionStats] = useState({
    questionsAsked: 0,
    subjectsExplored: new Set<string>(),
    languagesUsed: new Set<string>(),
  });
  const [activeChild, setActiveChild] = useState<any>(null);

  useEffect(() => {
    const bootstrap = require("bootstrap/dist/js/bootstrap.bundle.min.js");
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach((el) => new bootstrap.Tooltip(el));
    const popovers = document.querySelectorAll('[data-bs-toggle="popover"]');
    popovers.forEach((el) => new bootstrap.Popover(el));

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const saved = localStorage.getItem("dandaro_cache");
    if (saved) setCache(JSON.parse(saved));

    const child = localStorage.getItem("dandaro_active_child");
    if (child) {
      const c = JSON.parse(child);
      setActiveChild(c);
      setLanguage(c.preferredLanguage || "Shona");
      setGrade(c.gradeLevel || "Grade 3");
    }

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

  const findInCache = (q: string) =>
    cache.find((c) => c.question.toLowerCase() === q.toLowerCase());

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
      role: "user", content: question, timestamp: new Date(), isAI: false,
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setSessionStats((prev) => ({
      questionsAsked: prev.questionsAsked + 1,
      subjectsExplored: new Set([...prev.subjectsExplored, subject]),
      languagesUsed: new Set([...prev.languagesUsed, language]),
    }));

    const cached = findInCache(question);
    if (cached || !isOnline) {
      const answer = cached?.answer || "Sorry, this content is not available offline.";
      setMessages((prev) => [...prev, { role: "assistant", content: answer, timestamp: new Date(), isAI: true }]);
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
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer, timestamp: new Date(), isAI: true }]);
      saveToCache(question, data.answer);
    } catch {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "Sorry, there was an error generating content. Please try again.",
        timestamp: new Date(), isAI: true,
      }]);
    }
    setLoading(false);
    setQuestion("");
  };

  const langColor: any = { Shona: "#1e8449", Ndebele: "#2471a3", Tonga: "#7d3c98" };

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: "#f0f4f8" }}>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg shadow-sm sticky-top"
        style={{ background: "linear-gradient(135deg, #1a5276, #1e8449)" }}>
        <div className="container-fluid px-4">
          <a className="navbar-brand d-flex align-items-center gap-2 text-white fw-bold" href="/">
            <BookOpen size={24} /> Dandaro Learning
          </a>
          <div className="d-flex align-items-center gap-2 ms-auto">
            {/* Online badge */}
            <span className={`badge rounded-pill px-3 py-2 d-flex align-items-center gap-1 ${isOnline ? "bg-success" : "bg-danger"}`}>
              {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
              {isOnline ? "Online" : "Offline"}
            </span>

            {/* Analytics button */}
            <button className="btn btn-outline-light btn-sm d-flex align-items-center gap-1"
              data-bs-toggle="modal" data-bs-target="#analyticsModal">
              <BarChart3 size={14} /> Analytics
            </button>

            {/* Settings dropdown */}
            <div className="dropdown">
              <button className="btn btn-outline-light btn-sm dropdown-toggle" data-bs-toggle="dropdown">
                ⚙️ Settings
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow p-3" style={{ minWidth: "260px" }}>
                <li className="mb-2">
                  <label className="form-label fw-semibold small text-muted">🌍 Language</label>
                  <select className="form-select form-select-sm" value={language}
                    onChange={(e) => setLanguage(e.target.value)}>
                    {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
                  </select>
                </li>
                <li className="mb-2">
                  <label className="form-label fw-semibold small text-muted">📚 Grade Level</label>
                  <select className="form-select form-select-sm" value={grade}
                    onChange={(e) => setGrade(e.target.value)}>
                    {GRADES.map((g) => <option key={g}>{g}</option>)}
                  </select>
                </li>
                <li>
                  <label className="form-label fw-semibold small text-muted">📖 Subject</label>
                  <select className="form-select form-select-sm" value={subject}
                    onChange={(e) => setSubject(e.target.value)}>
                    {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </li>
              </ul>
            </div>

            <a href="/dashboard" className="btn btn-light btn-sm fw-bold text-success d-flex align-items-center gap-1">
              <Home size={14} /> Dashboard
            </a>
          </div>
        </div>
      </nav>

      {/* Offline Alert */}
      {!isOnline && (
        <div className="alert alert-warning alert-dismissible fade show m-3 d-flex align-items-center gap-2 mb-0">
          <WifiOff size={18} />
          <span><strong>You are offline.</strong> Cached content is still available.</span>
          <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
        </div>
      )}

      <div className="container-fluid px-4 py-3 flex-grow-1">
        <div className="row g-3 h-100">

          {/* LEFT SIDEBAR */}
          <div className="col-lg-3">

            {/* Active Child Card */}
            {activeChild && (
              <div className="card border-0 shadow-sm mb-3"
                style={{ borderRadius: "14px", borderTop: `4px solid ${langColor[activeChild.preferredLanguage] || "#1a5276"}` }}>
                <div className="card-body p-3 text-center">
                  <div style={{ fontSize: "2rem" }}>
                    {activeChild.preferredLanguage === "Shona" ? "🦁" : activeChild.preferredLanguage === "Ndebele" ? "🐘" : "🦒"}
                  </div>
                  <h6 className="fw-bold mb-0 mt-1" style={{ color: "#1a5276" }}>{activeChild.aliasName}</h6>
                  <small className="text-muted">{activeChild.gradeLevel} · {activeChild.preferredLanguage}</small>
                </div>
              </div>
            )}

            {/* Current Session */}
            <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: "14px" }}>
              <div className="card-body p-3">
                <h6 className="fw-bold mb-3" style={{ color: "#1a5276" }}>📋 Current Session</h6>
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">Language</small>
                    <span className="badge rounded-pill px-2"
                      style={{ background: langColor[language] || "#1a5276" }}>{language}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">Grade</small>
                    <span className="badge bg-secondary rounded-pill px-2">{grade}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">Subject</small>
                    <span className="badge bg-info text-dark rounded-pill px-2">{subject}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">Questions</small>
                    <span className="badge bg-success rounded-pill px-2">{sessionStats.questionsAsked}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sample Questions */}
            <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: "14px" }}>
              <div className="card-body p-3">
                <h6 className="fw-bold mb-3" style={{ color: "#1a5276" }}>💡 Sample Questions</h6>
                <div className="d-flex flex-column gap-2">
                  {[
                    "Explain addition with examples",
                    "What is photosynthesis?",
                    "Tell me a Shona proverb",
                    "How do plants grow?",
                    "What are the seasons?",
                  ].map((q, i) => (
                    <button key={i} onClick={() => setQuestion(q)}
                      className="btn btn-sm text-start fw-normal"
                      style={{ background: "#eaf4fb", color: "#1a5276", borderRadius: "8px", fontSize: "0.82em" }}>
                      💬 {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Ethical AI Badge */}
            <div className="card border-0 shadow-sm" style={{ borderRadius: "14px", borderLeft: "4px solid #1e8449" }}>
              <div className="card-body p-3">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <Shield size={16} className="text-success" />
                  <span className="fw-bold small text-success">Ethical AI</span>
                  <span className="ms-auto"
                    data-bs-toggle="tooltip"
                    data-bs-placement="right"
                    title="All content is moderated, age-appropriate, and curriculum-aligned to Zimbabwe MoPSE standards."
                    style={{ cursor: "pointer" }}>ℹ️</span>
                </div>
                <p className="text-muted mb-0" style={{ fontSize: "0.78em" }}>
                  All content is AI-generated, age-appropriate, and curriculum-aligned.
                </p>
              </div>
            </div>
          </div>

          {/* MAIN CHAT AREA */}
          <div className="col-lg-9 d-flex flex-column">

            {/* Subject Tabs */}
            <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: "14px" }}>
              <div className="card-body p-2">
                <ul className="nav nav-pills gap-1 flex-wrap">
                  {SUBJECTS.map((s) => (
                    <li key={s} className="nav-item">
                      <button
                        className={`nav-link fw-semibold ${subject === s ? "active" : ""}`}
                        style={subject === s ? { background: "linear-gradient(135deg, #1a5276, #1e8449)" } : { color: "#1a5276" }}
                        onClick={() => setSubject(s)}>
                        {s === "Mathematics" ? "🔢" : s === "Language Arts" ? "📝" : s === "Science" ? "🔬" : s === "Social Studies" ? "🌍" : "❤️"} {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="card border-0 shadow-sm flex-grow-1 mb-3"
              style={{ borderRadius: "14px", minHeight: "400px" }}>
              <div className="card-body p-3 overflow-auto" style={{ maxHeight: "450px" }}>
                {messages.length === 0 ? (
                  <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center py-5">
                    <BookOpen size={48} className="text-success mb-3 opacity-50" />
                    <h5 className="fw-bold" style={{ color: "#1a5276" }}>Welcome to Dandaro!</h5>
                    <p className="text-muted">Select your subject above, then ask any question to get started.</p>
                    <div className="d-flex gap-2 flex-wrap justify-content-center mt-2">
                      {["🔢 Maths", "🔬 Science", "📝 Language", "🌍 Social"].map((tag, i) => (
                        <span key={i} className="badge rounded-pill bg-light text-dark border px-3 py-2">{tag}</span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {messages.map((msg, i) => (
                      <div key={i} className={`d-flex ${msg.role === "user" ? "justify-content-end" : "justify-content-start"}`}>
                        <div style={{
                          maxWidth: "75%",
                          borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                          background: msg.role === "user"
                            ? "linear-gradient(135deg, #1a5276, #1e8449)"
                            : "white",
                          color: msg.role === "user" ? "white" : "#333",
                          padding: "12px 16px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        }}>
                          {msg.isAI && (
                            <div className="d-flex align-items-center justify-content-between mb-2">
                              <span className="badge rounded-pill px-2 py-1"
                                style={{ background: "#eaf4fb", color: "#1a5276", fontSize: "0.7em" }}>
                                🤖 AI Generated
                              </span>
                              <button
                                className="btn btn-sm p-0 ms-2 border-0"
                                style={{ background: "none" }}
                                onClick={() => speaking ? stopSpeaking() : speak(msg.content)}
                                data-bs-toggle="tooltip"
                                title={speaking ? "Stop speaking" : "Read aloud"}>
                                {speaking ? <MicOff size={14} className="text-danger" /> : <Mic size={14} className="text-success" />}
                              </button>
                            </div>
                          )}
                          <p className="mb-1 small" style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>{msg.content}</p>
                          <div className={`text-end ${msg.role === "user" ? "text-white-50" : "text-muted"}`}
                            style={{ fontSize: "0.7em" }}>
                            {msg.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="d-flex justify-content-start">
                        <div className="bg-white rounded-3 p-3 shadow-sm">
                          <div className="d-flex gap-1 align-items-center">
                            <span className="text-muted small me-2">Dandaro is thinking</span>
                            {[0, 1, 2].map(i => (
                              <div key={i} className="rounded-circle bg-success"
                                style={{ width: "8px", height: "8px", animation: `bounce 0.6s ${i * 0.1}s infinite alternate` }}></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Input Area */}
            <div className="card border-0 shadow-sm" style={{ borderRadius: "14px" }}>
              <div className="card-body p-3">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control border-0 bg-light"
                    style={{ borderRadius: "12px 0 0 12px" }}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && askQuestion()}
                    placeholder={`Ask a ${subject} question in ${language}...`}
                  />
                  <button
                    className="btn fw-bold text-white d-flex align-items-center gap-2 px-4"
                    style={{ background: "linear-gradient(135deg, #1a5276, #1e8449)", borderRadius: "0 12px 12px 0" }}
                    onClick={askQuestion}
                    disabled={loading || !question.trim()}>
                    {loading
                      ? <span className="spinner-border spinner-border-sm"></span>
                      : <><Send size={16} /> Ask</>}
                  </button>
                </div>
                <div className="d-flex align-items-center gap-2 mt-2 flex-wrap">
                  <small className="text-muted">
                    🌍 {language} · 📚 {grade} · 📖 {subject}
                  </small>
                  <span className="ms-auto">
                    {isOnline
                      ? <small className="text-success">☁️ Connected</small>
                      : <small className="text-warning">💾 Using cached content</small>}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Modal */}
      <div className="modal fade" id="analyticsModal" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ borderRadius: "20px" }}>
            <div className="modal-header border-0"
              style={{ background: "linear-gradient(135deg, #1a5276, #1e8449)" }}>
              <h5 className="modal-title text-white fw-bold">📊 Session Analytics</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body p-4">
              <div className="row g-3 text-center mb-4">
                {[
                  { label: "Questions Asked", value: sessionStats.questionsAsked, color: "#1a5276", emoji: "❓" },
                  { label: "Subjects Explored", value: sessionStats.subjectsExplored.size, color: "#1e8449", emoji: "📚" },
                  { label: "Languages Used", value: sessionStats.languagesUsed.size, color: "#7d3c98", emoji: "🌍" },
                  { label: "Cached Lessons", value: cache.length, color: "#e67e22", emoji: "💾" },
                ].map((stat, i) => (
                  <div key={i} className="col-6">
                    <div className="rounded-3 p-3" style={{ background: "#f8f9fa" }}>
                      <div style={{ fontSize: "1.8rem" }}>{stat.emoji}</div>
                      <div className="fw-bold fs-3 mt-1" style={{ color: stat.color }}>{stat.value}</div>
                      <div className="text-muted small">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Subjects breakdown */}
              <div className="mb-3">
                <small className="fw-bold text-muted text-uppercase">Subjects Explored</small>
                <div className="d-flex gap-2 flex-wrap mt-2">
                  {sessionStats.subjectsExplored.size === 0
                    ? <span className="text-muted small">None yet</span>
                    : [...sessionStats.subjectsExplored].map((s, i) => (
                        <span key={i} className="badge bg-success rounded-pill px-3 py-2">{s}</span>
                      ))}
                </div>
              </div>

              <div>
                <small className="fw-bold text-muted text-uppercase">Languages Used</small>
                <div className="d-flex gap-2 flex-wrap mt-2">
                  {sessionStats.languagesUsed.size === 0
                    ? <span className="text-muted small">None yet</span>
                    : [...sessionStats.languagesUsed].map((l, i) => (
                        <span key={i} className="badge rounded-pill px-3 py-2"
                          style={{ background: langColor[l] || "#1a5276" }}>{l}</span>
                      ))}
                </div>
              </div>
            </div>
            <div className="modal-footer border-0">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}