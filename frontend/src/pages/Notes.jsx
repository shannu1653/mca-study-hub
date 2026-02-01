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
  /* ================= DATA ================= */
  const [notes, setNotes] = useState([]);
  const [years, setYears] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FILTERS ================= */
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");

  /* ================= BOOKMARKS ================= */
  const [bookmarks, setBookmarks] = useState(
    JSON.parse(localStorage.getItem("bookmarks")) || []
  );
  const [showSaved, setShowSaved] = useState(false);

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

  /* ================= FILTER NOTES ================= */
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

  /* ================= VIEW ================= */
  /* ================= VIEW PDF ================= */
const handleView = async (note) => {
  try {
    const res = await api.get(`notes/${note.id}/`, {
      responseType: "blob",
    });

    const fileURL = URL.createObjectURL(
      new Blob([res.data], { type: "application/pdf" })
    );

    window.open(fileURL);
  } catch (err) {
    alert("Unable to open PDF");
    console.error(err);
  }
};

/* ================= DOWNLOAD PDF ================= */
const handleDownload = async (note) => {
  try {
    const res = await api.get(`notes/${note.id}/download/`, {
      responseType: "blob",
    });

    const url = URL.createObjectURL(
      new Blob([res.data], { type: "application/pdf" })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = `${note.title}.pdf`;
    link.click();
  } catch (err) {
    alert("Download failed");
    console.error(err);
  }
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
      {/* HEADER */}
      <div className="notes-header">
        <h2>Notes</h2>
        <p>Browse and download MCA study materials</p>
      </div>

      {/* HERO STATS */}
      <div className="hero-stats">
        <div className="stat-card">
          <span>📚</span>
          <div>
            <p className="stat-value">{notes.length}</p>
            <p>Total Notes</p>
          </div>
        </div>

        <div className="stat-card">
          <span>⭐</span>
          <div>
            <p className="stat-value">{bookmarks.length}</p>
            <p>Saved</p>
          </div>
        </div>

        <div className="stat-card">
          <span>🔥</span>
          <div>
            <p className="stat-value">
              {notes.filter((n) => isNewNote(n.created_at)).length}
            </p>
            <p>New This Week</p>
          </div>
        </div>
      </div>

      {/* SAVED TOGGLE */}
      <button
        className="saved-toggle"
        onClick={() => setShowSaved(!showSaved)}
      >
        {showSaved ? "Show All Notes" : "Show Saved"}
      </button>

      {/* FILTER BAR */}
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

      {/* LOADING */}
      {loading && <p>Loading...</p>}

      {/* TRENDING */}
      {!loading && trendingNotes.length > 0 && (
        <div className="trending-section">
          <h3>🔥 Trending Notes</h3>
          <div className="trending-grid">
            {trendingNotes.map((note) => (
              <div key={note.id} className="trending-card">
                <h4>{note.title}</h4>
                <p>
                  {note.subject.name} • {note.subject.semester.name}
                </p>
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
            {isNewNote(note.created_at) && (
              <span className="new-badge">NEW</span>
            )}

            <h3>{note.title}</h3>
            <p>
              {note.subject.name} • {note.subject.semester.name}
            </p>

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
