import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import "../styles/notes.css";

/* ================= UTIL ================= */
const isNewNote = (date) => {
  if (!date) return false;
  const d = new Date(date);
  return (Date.now() - d.getTime()) / 86400000 <= 7;
};

const Skeleton = () => (
  <div className="note-card skeleton">
    <div className="skeleton-title" />
    <div className="skeleton-meta" />
    <div className="skeleton-actions" />
  </div>
);

/* ================= PAGE ================= */
function Notes() {
  /* ---------- STATE ---------- */
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

  /* ---------- FETCH ---------- */
  useEffect(() => {
    (async () => {
      try {
        const [n, y] = await Promise.all([
          api.get("notes/"),
          api.get("notes/years/"),
        ]);
        setNotes(n.data || []);
        setYears(y.data || []);
      } catch {
        localStorage.clear();
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!year) return setSemesters([]);
    api.get(`notes/semesters/?year=${year}`).then(r => setSemesters(r.data || []));
  }, [year]);

  useEffect(() => {
    if (!semester) return setSubjects([]);
    api.get(`notes/subjects/?semester=${semester}`).then(r => setSubjects(r.data || []));
  }, [semester]);

  /* ---------- FILTER ---------- */
  const filtered = notes.filter(n =>
    n?.title?.toLowerCase().includes(search.toLowerCase()) &&
    (!year || n?.subject?.semester?.year?.id === Number(year)) &&
    (!semester || n?.subject?.semester?.id === Number(semester)) &&
    (!subject || n?.subject?.id === Number(subject))
  );

  const displayNotes = showSaved
    ? filtered.filter(n => bookmarks.includes(n.id))
    : filtered;

  /* ---------- BOOKMARK ---------- */
  const toggleBookmark = (id) => {
    const updated = bookmarks.includes(id)
      ? bookmarks.filter(b => b !== id)
      : [...bookmarks, id];

    setBookmarks(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
  };

  /* ---------- VIEW ---------- */
  const handleView = (note) => {
    if (!note?.pdf) {
      alert("PDF not available");
      return;
    }
    window.open(note.pdf, "_blank");
  };

  /* ---------- DOWNLOAD ---------- */
  const handleDownload = async (note) => {
    if (!note?.pdf) {
      alert("PDF not available");
      return;
    }

    // optimistic update
    setNotes(prev =>
      prev.map(n =>
        n.id === note.id
          ? { ...n, download_count: (n.download_count || 0) + 1 }
          : n
      )
    );

    // backend count update (GET only)
    api.get(`notes/notes/${note.id}/download/`).catch(() => {});

    window.open(note.pdf, "_blank");
  };

  /* ---------- SWIPE ---------- */
  const touchX = useRef(0);
  const onTouchStart = e => (touchX.current = e.touches[0].clientX);
  const onTouchEnd = (e, note) => {
    const diff = e.changedTouches[0].clientX - touchX.current;
    if (diff > 80) handleDownload(note);
    if (diff < -80) toggleBookmark(note.id);
  };

  /* ---------- TRENDING ---------- */
  const trending = notes
    .filter(n => (n.download_count || 0) >= 5 || isNewNote(n.created_at))
    .slice(0, 4);

  /* ---------- UI ---------- */
  return (
    <div className="notes-page">
      <h2>Notes</h2>
      <p>Browse and download MCA study materials</p>

      <button onClick={() => setShowSaved(!showSaved)}>
        {showSaved ? "Show All" : "Show Saved"}
      </button>

      <div className="filters-bar">
        <input placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} />

        <select value={year} onChange={e => setYear(e.target.value)}>
          <option value="">Select MCA Year</option>
          {years.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}
        </select>

        <select value={semester} onChange={e => setSemester(e.target.value)} disabled={!year}>
          <option value="">Select Semester</option>
          {semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>

        <select value={subject} onChange={e => setSubject(e.target.value)} disabled={!semester}>
          <option value="">Select Subject</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {loading && (
        <div className="notes-grid">
          {[1,2,3].map(i => <Skeleton key={i} />)}
        </div>
      )}

      {!loading && trending.length > 0 && (
        <div className="trending-section">
          <h3>🔥 Trending</h3>
          <div className="trending-grid">
            {trending.map(n => (
              <div key={n.id} className="trending-card">
                <h4>{n.title}</h4>
                <p>{n.subject.name} • {n.subject.semester.name}</p>
                <button onClick={() => handleView(n)}>View</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && displayNotes.length === 0 && (
        <p style={{ textAlign: "center" }}>No notes found</p>
      )}

      <div className="notes-grid">
        {displayNotes.map(note => (
          <div
            key={note.id}
            className="note-card"
            onTouchStart={onTouchStart}
            onTouchEnd={e => onTouchEnd(e, note)}
          >
            {isNewNote(note.created_at) && <span className="new-badge">NEW</span>}

            <h3>{note.title}</h3>
            <p>{note.subject.name} • {note.subject.semester.name}</p>

            <div className="note-actions">
              <button onClick={() => handleView(note)}>👁 View</button>
              <button onClick={() => handleDownload(note)}>
                ⬇ {note.download_count || 0}
              </button>
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

export default Notes;
