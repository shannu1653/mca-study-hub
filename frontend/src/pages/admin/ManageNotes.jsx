import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import "../../styles/manageNotes.css";

function ManageNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  /* ================= LOAD NOTES ================= */
  const loadNotes = async () => {
    try {
      setLoading(true);
      const res = await api.get("notes/");
      setNotes(res.data || []);
    } catch {
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  /* ================= DELETE ================= */
  const deleteNote = async (id, title) => {
    const ok = window.confirm(
      `Are you sure you want to delete:\n\n"${title}" ?`
    );
    if (!ok) return;

    try {
      await api.delete(`notes/${id}/`);
      toast.success("Note deleted successfully");
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= FILTER ================= */
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="manage-notes-page">
      {/* HEADER */}
      <div className="manage-header">
        <h2>📄 Manage Notes</h2>
        <p>View, search and delete uploaded notes</p>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search notes by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="admin-search"
      />

      {/* LOADING */}
      {loading && <p className="admin-loading">Loading notes...</p>}

      {/* EMPTY */}
      {!loading && filteredNotes.length === 0 && (
        <p className="admin-empty">No notes found</p>
      )}

      {/* LIST */}
      {!loading &&
        filteredNotes.map((note) => (
          <div key={note.id} className="admin-note-row">
            <div className="note-info">
              <strong>{note.title}</strong>
              <span>
                {note.subject?.name} •{" "}
                {note.subject?.semester?.name}
              </span>
            </div>

            <button
              className="danger"
              onClick={() => deleteNote(note.id, note.title)}
            >
              🗑 Delete
            </button>
          </div>
        ))}
    </div>
  );
}

export default ManageNotes;
