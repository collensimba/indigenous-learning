"use client";
import { useEffect } from "react";
import { BookOpen, Globe, Shield, Mic, BarChart3, Wifi } from "lucide-react";

export default function Home() {
  useEffect(() => {
    // Initialize Bootstrap tooltips
    const bootstrap = require("bootstrap/dist/js/bootstrap.bundle.min.js");
    const tooltipEls = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipEls.forEach(el => new bootstrap.Tooltip(el));

    // Initialize popovers
    const popoverEls = document.querySelectorAll('[data-bs-toggle="popover"]');
    popoverEls.forEach(el => new bootstrap.Popover(el));
  }, []);

  return (
    <main>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg sticky-top shadow-sm" style={{ background: "linear-gradient(135deg, #1a5276, #1e8449)" }}>
        <div className="container">
          <a className="navbar-brand d-flex align-items-center gap-2 text-white fw-bold fs-4" href="/">
            <BookOpen size={28} /> Dandaro
          </a>
          <button className="navbar-toggler border-white" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
            <span className="navbar-toggler-icon" style={{ filter: "invert(1)" }}></span>
          </button>
          <div className="collapse navbar-collapse" id="navMenu">
            <ul className="navbar-nav ms-auto align-items-center gap-2">
              <li className="nav-item">
                <a className="nav-link text-white" href="#features">Features</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="#languages">Languages</a>
              </li>
              <li className="nav-item">
                <a href="/login" className="btn btn-outline-light btn-sm px-4">Login</a>
              </li>
              <li className="nav-item">
                <a href="/register" className="btn btn-warning btn-sm px-4 fw-bold text-dark">Register</a>
              </li>
              <li className="nav-item">
                <a href="/learn" className="btn btn-light btn-sm px-4 fw-bold text-success">Start Learning</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* HERO with Carousel */}
      <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active"></button>
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1"></button>
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2"></button>
        </div>
        <div className="carousel-inner">
          {/* Slide 1 */}
          <div className="carousel-item active">
            <div style={{ background: "linear-gradient(135deg, #1a5276 0%, #1e8449 100%)", minHeight: "520px" }}
              className="d-flex align-items-center justify-content-center text-white text-center px-4">
              <div>
                <h1 className="display-4 fw-bold mb-3">Kudzidza Mutauro Wedu</h1>
                <p className="fs-5 text-white-50 mb-2">Learning Our Language</p>
                <p className="lead mb-4" style={{ color: "rgba(255,255,255,0.85)" }}>
                  AI-powered learning support for Shona, Ndebele, and Tonga —<br />
                  aligned to Zimbabwe's MoPSE curriculum for Grades ECD to 7.
                </p>
                <a href="/register" className="btn btn-warning btn-lg fw-bold px-5 me-3">Get Started Free</a>
                <a href="/learn" className="btn btn-outline-light btn-lg px-5">Try Demo</a>
              </div>
            </div>
          </div>
          {/* Slide 2 */}
          <div className="carousel-item">
            <div style={{ background: "linear-gradient(135deg, #145a32 0%, #1a5276 100%)", minHeight: "520px" }}
              className="d-flex align-items-center justify-content-center text-white text-center px-4">
              <div>
                <h1 className="display-4 fw-bold mb-3">🤖 AI-Powered Learning</h1>
                <p className="lead mb-4" style={{ color: "rgba(255,255,255,0.85)" }}>
                  Ask questions in Shona, Ndebele, or Tonga.<br />
                  Get curriculum-aligned answers instantly — day or night.
                </p>
                <a href="/register" className="btn btn-warning btn-lg fw-bold px-5">Create Account</a>
              </div>
            </div>
          </div>
          {/* Slide 3 */}
          <div className="carousel-item">
            <div style={{ background: "linear-gradient(135deg, #7d3c98 0%, #1a5276 100%)", minHeight: "520px" }}
              className="d-flex align-items-center justify-content-center text-white text-center px-4">
              <div>
                <h1 className="display-4 fw-bold mb-3">🛡️ Safe for Children</h1>
                <p className="lead mb-4" style={{ color: "rgba(255,255,255,0.85)" }}>
                  Content moderation, parental controls, and ethical AI safeguards<br />
                  protect every young learner on Dandaro.
                </p>
                <a href="/register" className="btn btn-warning btn-lg fw-bold px-5">Register Your Child</a>
              </div>
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>

      {/* ALERT BANNER */}
      <div className="container mt-4">
        <div className="alert alert-success alert-dismissible fade show d-flex align-items-center gap-2" role="alert">
          <Shield size={20} />
          <span><strong>Ethical AI Certified</strong> — All content is moderated, age-appropriate, and aligned to Zimbabwe's MoPSE curriculum.</span>
          <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
        </div>
      </div>

      {/* FEATURES */}
      <section id="features" className="py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-2" style={{ color: "#1a5276" }}>Platform Features</h2>
          <p className="text-center text-muted mb-5">Everything your child needs to learn in their mother tongue</p>
          <div className="row g-4">
            {[
              { icon: <Globe size={36} className="text-success" />, title: "3 Indigenous Languages", desc: "Full support for Shona, Ndebele, and Tonga with curriculum-aligned content", tooltip: "Covers all MoPSE indigenous language requirements" },
              { icon: <Shield size={36} className="text-success" />, title: "Safe for Children", desc: "Content moderation and ethical AI safeguards protect young learners", tooltip: "Compliant with Zimbabwe's Cybersecurity and Data Protection Act 2021" },
              { icon: <Mic size={36} className="text-success" />, title: "Voice Support", desc: "Text-to-speech output for all AI-generated content in target languages", tooltip: "Powered by Web Speech API" },
              { icon: <BarChart3 size={36} className="text-success" />, title: "Learning Analytics", desc: "Track progress across subjects and grades with detailed dashboards", tooltip: "Real-time session analytics for parents" },
              { icon: <Wifi size={36} className="text-success" />, title: "Offline Ready", desc: "Access cached content without internet connectivity", tooltip: "Works on 3G and below via localStorage caching" },
              { icon: <BookOpen size={36} className="text-success" />, title: "MoPSE Aligned", desc: "Content mapped to Zimbabwe's national curriculum framework", tooltip: "Grades ECD through Grade 7" },
            ].map((f, i) => (
              <div key={i} className="col-md-4">
                <div className="card h-100 border-0 shadow-sm hover-shadow">
                  <div className="card-body p-4">
                    <div className="mb-3">{f.icon}</div>
                    <h5 className="card-title fw-bold" style={{ color: "#1a5276" }}>
                      {f.title}{" "}
                      <span
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title={f.tooltip}
                        style={{ cursor: "pointer" }}
                      >
                        <span className="badge bg-success-subtle text-success rounded-pill" style={{ fontSize: "0.7em" }}>ℹ️</span>
                      </span>
                    </h5>
                    <p className="card-text text-muted">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — Collapse */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center fw-bold mb-4" style={{ color: "#1a5276" }}>How Dandaro Works</h2>
          <div className="accordion" id="howItWorks">
            {[
              { q: "1. Parent registers and creates a child profile", a: "The parent signs up with their email, gives consent for data processing under Zimbabwe's Data Protection Act, and creates an alias profile for their child — selecting grade level and preferred indigenous language." },
              { q: "2. Child selects a subject and asks a question", a: "The learner picks their subject (Mathematics, Science, Language Arts, Social Studies, or Health) and types or speaks their question in Shona, Ndebele, or Tonga." },
              { q: "3. Dandaro AI generates a curriculum-aligned answer", a: "The AI Orchestration Service constructs a grade-calibrated prompt, calls the Groq LLaMA 3 model, moderates the output for safety, and returns a structured explanation with an example and practice question." },
              { q: "4. Parent reviews analytics and progress", a: "The parent dashboard shows learning history, subjects explored, languages used, and AI-generated study recommendations — giving parents full visibility into their child's learning journey." },
            ].map((item, i) => (
              <div className="accordion-item border-0 shadow-sm mb-2 rounded" key={i}>
                <h2 className="accordion-header">
                  <button className={`accordion-button fw-bold ${i !== 0 ? "collapsed" : ""}`} type="button"
                    data-bs-toggle="collapse" data-bs-target={`#step${i}`}
                    style={{ color: "#1a5276", background: i === 0 ? "#eaf4fb" : "white" }}>
                    {item.q}
                  </button>
                </h2>
                <div id={`step${i}`} className={`accordion-collapse collapse ${i === 0 ? "show" : ""}`} data-bs-parent="#howItWorks">
                  <div className="accordion-body text-muted">{item.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LANGUAGES */}
      <section id="languages" className="py-5" style={{ background: "#1a5276" }}>
        <div className="container">
          <h2 className="text-center fw-bold text-white mb-5">Supported Languages</h2>
          <div className="row g-4 justify-content-center">
            {[
              { lang: "Shona", greeting: "Mhoro!", speakers: "~10 million speakers", color: "#1e8449",
                popover: "Shona is the most widely spoken indigenous language in Zimbabwe, used primarily in Mashonaland and Manicaland provinces." },
              { lang: "Ndebele", greeting: "Sawubona!", speakers: "~2 million speakers", color: "#2471a3",
                popover: "Ndebele is spoken primarily in Matabeleland North and South provinces and parts of Midlands." },
              { lang: "Tonga", greeting: "Mwapona!", speakers: "~130,000 speakers", color: "#7d3c98",
                popover: "Tonga is spoken along the Zambezi Valley in Zimbabwe, primarily in Binga district." },
            ].map((l, i) => (
              <div key={i} className="col-md-4">
                <div className="card border-0 text-white text-center h-100 shadow"
                  style={{ background: l.color, borderRadius: "16px" }}>
                  <div className="card-body p-4">
                    <h3 className="fw-bold mb-2">{l.lang}</h3>
                    <p className="display-6 mb-3">{l.greeting}</p>
                    <p className="opacity-75 mb-3">{l.speakers}</p>
                    <button className="btn btn-outline-light btn-sm"
                      data-bs-toggle="popover"
                      data-bs-placement="top"
                      data-bs-content={l.popover}
                      data-bs-trigger="focus"
                      title={`About ${l.lang}`}>
                      Learn more ℹ️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5 text-center" style={{ background: "#f0f4f8" }}>
        <div className="container">
          <h2 className="fw-bold mb-3" style={{ color: "#1a5276" }}>Ready to start learning?</h2>
          <p className="text-muted mb-4 fs-5">Join thousands of Zimbabwean families supporting indigenous language education</p>
          <a href="/register" className="btn btn-success btn-lg px-5 fw-bold me-3">Create Free Account</a>
          <button className="btn btn-outline-secondary btn-lg px-5"
            data-bs-toggle="modal" data-bs-target="#demoModal">
            Watch Demo
          </button>
        </div>
      </section>

      {/* DEMO MODAL */}
      <div className="modal fade" id="demoModal" tabIndex={-1}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header" style={{ background: "linear-gradient(135deg, #1a5276, #1e8449)" }}>
              <h5 className="modal-title text-white fw-bold">🌍 Dandaro — Platform Demo</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body p-4">
              <div className="row g-4 text-center">
                {[
                  { emoji: "1️⃣", title: "Register", desc: "Parent signs up and creates a child profile with alias name and preferred language" },
                  { emoji: "2️⃣", title: "Ask", desc: "Child asks any subject question in Shona, Ndebele or Tonga" },
                  { emoji: "3️⃣", title: "Learn", desc: "AI returns a grade-appropriate explanation, example, and practice question" },
                  { emoji: "4️⃣", title: "Track", desc: "Parent views analytics dashboard showing learning history and recommendations" },
                ].map((s, i) => (
                  <div key={i} className="col-6">
                    <div className="p-3 rounded-3" style={{ background: "#eaf4fb" }}>
                      <div className="fs-1 mb-2">{s.emoji}</div>
                      <h6 className="fw-bold" style={{ color: "#1a5276" }}>{s.title}</h6>
                      <p className="text-muted small mb-0">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <a href="/register" className="btn btn-success fw-bold">Get Started Now</a>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="py-4 text-center" style={{ background: "#0d3349" }}>
        <p className="text-white-50 mb-1">© 2026 Dandaro — AI-Enabled Indigenous Language Learning System</p>
        <p className="text-white-50 small">Aligned to Zimbabwe MoPSE Curriculum | Ethical AI Certified | ZDPA 2021 Compliant</p>
      </footer>
    </main>
  );
}