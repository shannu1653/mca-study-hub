import { useEffect, useState } from "react";
import api from "../../api/axios";
import Layout from "../../layout/Layout";
import toast from "react-hot-toast";

function ManageNotes() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const res = await api.get("notes/");
    setNotes(res.data);
  };

  const deleteNote = async (id) => {
    if (!window.confirm("Delete this note?")) return;

    await api.delete(`/notes/${id}/`);
    toast.success("Note deleted");
    loadNotes();
  };

  return (
    <Layout>
      <h2>Manage Notes</h2>

      {notes.map((note) => (
        <div key={note.id} className="admin-note-row">
          <b>{note.title}</b>
          <span>{note.subject.name}</span>

          <button onClick={() => deleteNote(note.id)}>Delete</button>
        </div>
      ))}
    </Layout>
  );
}

export default ManageNotes;
