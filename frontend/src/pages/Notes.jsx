import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import "../styles/notes.css";

/* ================= HELPER ================= */
const isNewNote = (createdAt) => {
  const noteDate = new Date(createdAt);
  const now = new Date();
  const diffDays = (now - noteDate) / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
};

/* ================= NOTES PAGE ================= */
function Notes() {
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
  const [showSaved] = useState(false);

  /* ================= FETCH NOTES ================= */
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [notesRes, yearsRes] = await Promise.all([
        api.get("notes/"),
        api.get("notes/years/"),
      ]);
      setNotes(notesRes.data);
      setYears(yearsRes.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH SEMESTERS ================= */
  useEffect(() => {
    if (!year) {
      setSemesters([]);
      setSemester("");
      return;
    }

    api
      .get(`notes/semesters/?year=${year}`)
      .then((res) => setSemesters(res.data))
      .catch(() => setSemesters([]));
  }, [year]);

  /* ================= FETCH SUBJECTS ================= */
  useEffect(() => {
    if (!semester) {
      setSubjects([]);
      setSubject("");
      return;
    }

    api
      .get(`notes/subjects/?semester=${semester}`)
      .then((res) => setSubjects(res.data))
      .catch(() => setSubjects([]));
  }, [semester]);

  /* ================= FILTER ================= */
  const filteredNotes = notes.filter((note) => {
    return (
      note.title.toLowerCase().includes(search.toLowerCase()) &&
      (!year || note.subject.semester.year.id === Number(year)) &&
      (!semester || note.subject.semester.id === Number(semester)) &&
      (!subject || note.subject.id === Number(subject))
    );
  });

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

  /* ================= VIEW (FIXED) ================= */
  const handleView = (note) => {
    if (!note.file) {
      alert("File not available");
      return;
    }
    window.open(note.file, "_blank");
  };

  /* ================= DOWNLOAD (FIXED) ================= */
  const handleDownload = async (note) => {
    try {
      // increase download count
      await api.post(`notes/notes/${note.id}/download/`);
    } catch {
      console.warn("Download count failed");
    }

    if (!note.file) {
      alert("File not available");
      return;
    }

    const link = document.createElement("a");
    link.href = note.file;
    link.download = `${note.title}.pdf`;
    link.target = "_blank";
    link.click();
  };

  /* ================= SWIPE ================= */
  const touchStartX = useRef(0);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e, note) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 80) handleDownload(note);
    if (diff < -80) toggleBookmark(note.id);
  };

  /* ================= TRENDING ================= */
  const trendingNotes = notes
    .filter(
      (n) => (n.download_count || 0) >= 5 || isNewNote(n.created_at)
    )
    .slice(0, 4);

  /* ================= UI ================= */
  return (
    <div className="notes-page">
      <div className="notes-header">
        <h2>Notes</h2>
        <p>Browse and download MCA study materials</p>
      </div>

      {loading && <p>Loading...</p>}

      <div className="notes-grid">
        {displayNotes.map((note) => (
          <div
            key={note.id}
            className="note-card"
            onTouchStart={onTouchStart}
            onTouchEnd={(e) => onTouchEnd(e, note)}
          >
            {isNewNote(note.created_at) && (
              <span className="new-badge">NEW</span>
            )}

            <div className="note-header">
              <h3>{note.title}</h3>
              <button
                className="bookmark-btn"
                onClick={() => toggleBookmark(note.id)}
              >
                {bookmarks.includes(note.id) ? "⭐" : "☆"}
              </button>
            </div>

            <p className="note-meta">
              {note.subject.name} • {note.subject.semester.name}
            </p>

            <div className="note-actions">
              <button onClick={() => handleView(note)}>👁 View</button>
              <button onClick={() => handleDownload(note)}>
                ⬇ {note.download_count || 0}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notes;
