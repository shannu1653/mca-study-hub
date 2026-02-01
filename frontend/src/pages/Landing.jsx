import { Link } from "react-router-dom";
import { useEffect } from "react";
import "../styles/landing.css";
import PageTransition from "../components/PageTransition";

export default function Landing() {

  /* ================= SCROLL ANIMATION ================= */
  useEffect(() => {
    const reveal = () => {
      const elements = document.querySelectorAll(".reveal");

      elements.forEach((el) => {
        const top = el.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (top < windowHeight - 80) {
          el.classList.add("active");
        }
      });
    };

    window.addEventListener("scroll", reveal);
    reveal();

    return () => window.removeEventListener("scroll", reveal);
  }, []);

  return (
    <PageTransition>
      <div className="landing">

        {/* ================= NAVBAR ================= */}
        <header className="landing-navbar">
          <div className="nav-container">
            <div className="nav-logo">
              🎓 MCA Study Hub
            </div>

            <nav className="nav-links">
              <a href="#features">Features</a>
              <a href="#about">About</a>
            </nav>

            <div className="nav-actions">
              <Link to="/login" className="nav-login">
                Login
              </Link>
              <Link to="/register" className="nav-cta">
                Get Started
              </Link>
            </div>
          </div>
        </header>

        {/* ================= HERO ================= */}
        <section className="landing-hero reveal">
          <h1>
            Smart Learning for MCA Students 🚀
          </h1>

          <p>
            All MCA notes, subjects & semesters in one powerful platform.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="btn primary">
              Create Free Account
            </Link>
            <Link to="/login" className="btn outline">
              Login
            </Link>
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section id="features" className="landing-features reveal">
          <h2>Why Choose MCA Study Hub?</h2>

          <div className="features-grid">
            <div className="feature-card">
              📚
              <h3>Organized Notes</h3>
              <p>Year, semester & subject-wise PDFs.</p>
            </div>

            <div className="feature-card">
              ⭐
              <h3>Save Notes</h3>
              <p>Bookmark important PDFs instantly.</p>
            </div>

            <div className="feature-card">
              🔍
              <h3>Fast Search</h3>
              <p>Find what you need in seconds.</p>
            </div>

            <div className="feature-card">
              📱
              <h3>Mobile Ready</h3>
              <p>Perfect experience on phone & desktop.</p>
            </div>
          </div>
        </section>

        {/* ================= PREVIEW ================= */}
        <section className="landing-preview reveal">
          <h2>See the App in Action</h2>
          <p>Designed for speed, clarity, and productivity.</p>

          <div className="preview-grid">
            <div className="preview-card">
              <div className="preview-mock desktop">🖥️ Dashboard</div>
              <h4>User Dashboard</h4>
              <p>Track notes & bookmarks.</p>
            </div>

            <div className="preview-card">
              <div className="preview-mock notes">📄 Notes</div>
              <h4>Notes Library</h4>
              <p>Structured & clean PDFs.</p>
            </div>

            <div className="preview-card">
              <div className="preview-mock mobile">📱 Mobile</div>
              <h4>Mobile Friendly</h4>
              <p>Study anywhere.</p>
            </div>
          </div>
        </section>

        {/* ================= TESTIMONIALS ================= */}
        <section className="landing-testimonials reveal">
          <h2>What Students Say</h2>

          <div className="testimonial-grid">
            <div className="testimonial-card">
              “This app saved me hours before exams.”
              <span>— Ramesh</span>
            </div>

            <div className="testimonial-card">
              “Best MCA notes platform.”
              <span>— Anjali</span>
            </div>

            <div className="testimonial-card">
              “One app, all notes.”
              <span>— Suresh</span>
            </div>
          </div>
        </section>

        {/* ================= ABOUT ================= */}
        <section id="about" className="landing-about reveal">
          <h2>Built for MCA Students</h2>
          <p>
            No confusion. No clutter. Just focused learning.
          </p>
        </section>

        {/* ================= CTA ================= */}
        <section className="landing-cta reveal">
          <h2>Start Learning Smarter Today</h2>
          <Link to="/register" className="btn primary">
            Join Now – It’s Free
          </Link>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="landing-footer">
          © {new Date().getFullYear()} MCA Study Hub · Designed for Students
        </footer>

      </div>
    </PageTransition>
  );
}
