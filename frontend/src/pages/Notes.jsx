import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import Layout from "../layout/Layout";
import "../styles/notes.css";

/* ================= HELPER: NEW BADGE ================= */
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

  /* ================= FETCH ALL ================= */
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
    } catch {
      console.log("Failed to load notes");
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

    api.get("notes/semesters/").then((res) => {
      setSemesters(res.data.filter((s) => s.year === Number(year)));
    });
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
      .then((res) => setSubjects(res.data));
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

  /* ================= DOWNLOAD ================= */
  const handleDownload = async (note) => {
    try {
      await api.post(`notes/${note.id}/download/`);
    } catch {}
    window.open(note.pdf_url, "_blank");
  };

  /* ================= SWIPE ================= */
  const touchStartX = useRef(0);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e, note) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 80) handleDownload(note); // swipe right
    if (diff < -80) toggleBookmark(note.id); // swipe left
  };

  /* ================= UI ================= */
  return (
    <Layout search={search} setSearch={setSearch}>
      <div className="notes-page">
        <div className="notes-header">
          <h2>Notes</h2>
          <p>Browse and download MCA study materials</p>

          <button
            className="saved-btn"
            onClick={() => setShowSaved(!showSaved)}
          >
            ⭐ Saved Notes
          </button>
        </div>

        {/* ================= FILTER BAR ================= */}
        <div className="filters-bar">
          <input
            placeholder="Search subject / notes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              setSemester("");
              setSubject("");
            }}
          >
            <option value="">Select MCA Year</option>
            {years.map((y) => (
              <option key={y.id} value={y.id}>
                {y.name}
              </option>
            ))}
          </select>

          <select
            value={semester}
            onChange={(e) => {
              setSemester(e.target.value);
              setSubject("");
            }}
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
            <option value="">
              {semester ? "Select Subject" : "Select Semester first"}
            </option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>

          <button
            className="reset-btn"
            onClick={() => {
              setSearch("");
              setYear("");
              setSemester("");
              setSubject("");
            }}
          >
            Reset Filters
          </button>
        </div>

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="skeleton-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-card"></div>
            ))}
          </div>
        )}

        {!loading && displayNotes.length === 0 && (
          <div className="empty-state">
            <h3>No notes found 📂</h3>
            <p>Try changing filters</p>
          </div>
        )}

        {/* ================= NOTES GRID ================= */}
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

              <div className="note-info">
                <h3>{note.title}</h3>
                <span>
                  {note.subject.semester.year.name} •{" "}
                  {note.subject.semester.name}
                </span>
                <p>{note.subject.name}</p>
              </div>

              <iframe src={note.pdf_url} title={note.title} />

              <div className="note-actions">
                <button onClick={() => handleDownload(note)}>
                  ⬇ Download ({note.download_count || 0})
                </button>

                <button onClick={() => toggleBookmark(note.id)}>
                  {bookmarks.includes(note.id) ? "⭐" : "☆"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Notes;
