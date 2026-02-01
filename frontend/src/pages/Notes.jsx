import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import "../styles/notes.css";

/* ================= HELPER ================= */
const isNewNote = (createdAt) => {
  const noteDate = new Date(createdAt);
  const now = new Date();
  return (now - noteDate) / (1000 * 60 * 60 * 24) <= 7;
};

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

  /* ================= FETCH NOTES + YEARS ================= */
  useEffect(() => {
    Promise.all([
      api.get("notes/"),
      api.get("notes/years/"),
    ])
      .then(([notesRes, yearsRes]) => {
        setNotes(notesRes.data || []);
        setYears(yearsRes.data || []);
      })
      .catch(() => {
        alert("Session expired. Please login again.");
        localStorage.clear();
        window.location.href = "/login";
      })
      .finally(() => setLoading(false));
  }, []);

  /* ================= SEMESTERS ================= */
  useEffect(() => {
    if (!year) {
      setSemesters([]);
      setSemester("");
      return;
    }

    api
      .get(`notes/semesters/?year=${year}`)
      .then((res) => setSemesters(res.data || []))
      .catch(() => setSemesters([]));
  }, [year]);

  /* ================= SUBJECTS ================= */
  useEffect(() => {
    if (!semester) {
      setSubjects([]);
      setSubject("");
      return;
    }

    api
      .get(`notes/subjects/?semester=${semester}`)
      .then((res) => setSubjects(res.data || []))
      .catch(() => setSubjects([]));
  }, [semester]);

  /* ================= FILTER ================= */
  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase()) &&
    (!year || n.subject.semester.year.id === Number(year)) &&
    (!semester || n.subject.semester.id === Number(semester)) &&
    (!subject || n.subject.id === Number(subject))
  );

  const displayNotes = showSaved
    ? filteredNotes.filter((n) => bookmarks.includes(n.id))
    : filteredNotes;

  /* ================= BOOKMARK ================= */
  const toggleBookmark = (id) => {
    const updated = bookmarks.includes(id)
      ? bookmarks.filter((b) => b !== id)
      : [...bookmarks, id];

    setBookmarks(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
  };

  /* ================= VIEW PDF (FIXED) ================= */
  const handleView = (note) => {
    if (!note.file) {
      alert("PDF not available");
      return;
    }
    window.open(note.file, "_blank");
  };

  /* ================= DOWNLOAD PDF (FIXED) ================= */
  const handleDownload = (note) => {
    if (!note.file) {
      alert("PDF not available");
      return;
    }

    const link = document.createElement("a");
    link.href = note.file;
    link.download = `${note.title}.pdf`;
    link.target = "_blank";
    link.click();
  };

  /* ================= SWIPE SUPPORT ================= */
  const touchStartX = useRef(0);
  const onTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
  const onTouchEnd = (e, note) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 80) handleDownload(note);
    if (diff < -80) toggleBookmark(note.id);
  };

  /* ================= TRENDING ================= */
  const trendingNotes = notes
    .filter((n) => isNewNote(n.created_at))
    .slice(0, 4);

  /* ================= UI ================= */
  return (
    <div className="notes-page">
      <h2>Notes</h2>
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
            <option key={y.id} value={y.id}>{y.name}</option>
          ))}
        </select>

        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          disabled={!year}
        >
          <option value="">Select Semester</option>
          {semesters.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={!semester}
        >
          <option value="">Select Subject</option>
          {subjects.map((sub) => (
            <option key={sub.id} value={sub.id}>{sub.name}</option>
          ))}
        </select>
      </div>

      {loading && <p>Loading...</p>}

      {/* TRENDING */}
      {!loading && trendingNotes.length > 0 && (
        <div className="trending-section">
          <h3>🔥 New Notes</h3>
          <div className="trending-grid">
            {trendingNotes.map((note) => (
              <div key={note.id} className="trending-card">
                <h4>{note.title}</h4>
                <p>{note.subject.name}</p>
                <button onClick={() => handleView(note)}>View</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NOTES GRID */}
      <div className="notes-grid">
        {displayNotes.map((note) => (
          <div
            key={note.id}
            className="note-card"
            onTouchStart={onTouchStart}
            onTouchEnd={(e) => onTouchEnd(e, note)}
          >
            {isNewNote(note.created_at) && <span className="new-badge">NEW</span>}

            <h3>{note.title}</h3>
            <p>{note.subject.name} • {note.subject.semester.name}</p>

            <div className="note-actions">
              <button onClick={() => handleView(note)}>👁 View</button>
              <button onClick={() => handleDownload(note)}>⬇ Download</button>
              <button onClick={() => toggleBookmark(note.id)}>
                {bookmarks.includes(note.id) ? "⭐" : "☆"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
