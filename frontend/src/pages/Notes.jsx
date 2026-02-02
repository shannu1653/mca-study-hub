import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import "../styles/notes.css";

/* ================= HELPERS ================= */
const isNewNote = (createdAt) => {
  const noteDate = new Date(createdAt);
  const now = new Date();
  return (now - noteDate) / (1000 * 60 * 60 * 24) <= 7;
};

const ITEMS_PER_PAGE = 6;

export default function Notes() {
  /* ================= STATE ================= */
  const [notes, setNotes] = useState([]);
  const [years, setYears] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");

  const [bookmarks, setBookmarks] = useState(
    JSON.parse(localStorage.getItem("bookmarks")) || []
  );
  const [showSaved, setShowSaved] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  /* ================= FETCH NOTES + YEARS ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notesRes, yearsRes] = await Promise.all([
          api.get("/notes/"),
          api.get("/notes/years/"),
        ]);

        setNotes(notesRes.data || []);
        setYears(yearsRes.data || []);
      } catch (err) {
        if (err.response?.status === 401) {
          alert("Session expired. Please login again.");
          localStorage.clear();
          window.location.href = "/login";
        } else {
          console.error("Notes fetch failed", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ================= RESET SCROLL ================= */
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [search, year, semester, subject, showSaved]);

  /* ================= SEMESTERS ================= */
  useEffect(() => {
    setSemester("");
    setSubject("");
    setSubjects([]);

    if (!year) {
      setSemesters([]);
      return;
    }

    api
      .get(`/notes/semesters/?year=${year}`)
      .then((res) => setSemesters(res.data || []))
      .catch(() => setSemesters([]));
  }, [year]);

  /* ================= SUBJECTS ================= */
  useEffect(() => {
    setSubject("");

    if (!semester) {
      setSubjects([]);
      return;
    }

    api
      .get(`/notes/subjects/?semester=${semester}`)
      .then((res) => setSubjects(res.data || []))
      .catch(() => setSubjects([]));
  }, [semester]);

  /* ================= FILTER ================= */
  const filteredNotes = notes.filter((n) => {
    return (
      n.title?.toLowerCase().includes(search.trim().toLowerCase()) &&
      (!year || n.subject?.semester?.year?.id === Number(year)) &&
      (!semester || n.subject?.semester?.id === Number(semester)) &&
      (!subject || n.subject?.id === Number(subject))
    );
  });

  const finalNotes = showSaved
    ? filteredNotes.filter((n) => bookmarks.includes(n.id))
    : filteredNotes;

  const displayNotes = finalNotes.slice(0, visibleCount);

  /* ================= BOOKMARK ================= */
  const toggleBookmark = (id) => {
    const updated = bookmarks.includes(id)
      ? bookmarks.filter((b) => b !== id)
      : [...bookmarks, id];

    setBookmarks(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
  };

  /* ================= OPEN PDF ================= */
  const openPdf = (note) => {
    if (!note.pdf_url) {
      alert("PDF not available");
      return;
    }
    window.open(note.pdf_url, "_blank", "noopener");
  };

  /* ================= INFINITE SCROLL ================= */
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 200
    ) {
      setVisibleCount((prev) =>
        prev < finalNotes.length ? prev + ITEMS_PER_PAGE : prev
      );
    }
  }, [finalNotes.length]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  /* ================= UI ================= */
  return (
    <div className="notes-page">
      <h2>📚 Notes</h2>
      <p>Browse and download MCA study materials</p>

      <button onClick={() => setShowSaved(!showSaved)}>
        {showSaved ? "Show All Notes" : "Show Saved"}
      </button>

      {/* FILTERS */}
      <div className="filters-bar">
        <input
          placeholder="Search notes"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">Select MCA Year</option>
          {years.map((y) => (
            <option key={y.id} value={y.id}>
              {y.name}
            </option>
          ))}
        </select>

        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          disabled={!year}
        >
          <option value="">Select Semester</option>
          {semesters.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={!semester}
        >
          <option value="">Select Subject</option>
          {subjects.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading...</p>}

      {!loading && finalNotes.length === 0 && (
        <p style={{ textAlign: "center", marginTop: 40 }}>
          No notes found.
        </p>
      )}

      {/* NOTES GRID */}
      <div className="notes-grid">
        {displayNotes.map((note) => (
          <div key={note.id} className="note-card">
            {isNewNote(note.created_at) && (
              <span className="new-badge">NEW</span>
            )}

            <h3>{note.title}</h3>
            <p className="note-meta">
              {note.subject?.name} • {note.subject?.semester?.name}
            </p>

            <div
              className="pdf-preview"
              onClick={() => openPdf(note)}
            >
              📄 Open PDF • {note.download_count || 0} downloads
            </div>

            <div className="note-actions">
              <button onClick={() => openPdf(note)}>👁 View</button>
              <button onClick={() => openPdf(note)}>⬇ Download</button>
              <button onClick={() => toggleBookmark(note.id)}>
                {bookmarks.includes(note.id) ? "⭐" : "☆"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {visibleCount < finalNotes.length && (
        <p style={{ textAlign: "center", margin: 20 }}>
          Loading more notes...
        </p>
      )}
    </div>
  );
}
