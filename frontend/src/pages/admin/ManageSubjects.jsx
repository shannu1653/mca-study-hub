import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import "../../styles/ManageSubjects.css"

function ManageSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [semesterId, setSemesterId] = useState("");
  const [name, setName] = useState("");

  const isAdmin = localStorage.getItem("is_admin") === "true";

  // Load semesters
  const loadSemesters = async () => {
    try {
      const res = await api.get("/notes/semesters/");
      setSemesters(res.data);
    } catch {
      toast.error("Failed to load semesters");
    }
  };

  // Load subjects
  const loadSubjects = async () => {
    try {
      const res = await api.get("/notes/subjects/");
      setSubjects(res.data);
    } catch {
      toast.error("Failed to load subjects");
    }
  };

  useEffect(() => {
    loadSemesters();
    loadSubjects();
  }, []);

  // Add subject
  const addSubject = async () => {
    if (!isAdmin) {
      toast.error("Only admin can add subject");
      return;
    }

    if (!semesterId || !name.trim()) {
      toast.error("All fields required");
      return;
    }

    try {
      await api.post("/notes/subjects/", {
        semester: semesterId,
        name: name.trim(),
      });

      toast.success("Subject added");
      setName("");
      loadSubjects();
    } catch (err) {
      toast.error("Failed to add subject");
      console.error(err);
    }
  };

  // Delete subject
  const deleteSubject = async (id) => {
    if (!window.confirm("Delete subject?")) return;

    try {
      await api.delete(`/notes/subjects/${id}/`);
      toast.success("Subject deleted");
      loadSubjects();
    } catch {
      toast.error("Failed to delete subject");
    }
  };

  return (
    <div className="card">
      <h2>Manage Subjects</h2>

      {/* Semester dropdown */}
      <select
        value={semesterId}
        onChange={(e) => setSemesterId(e.target.value)}
      >
        <option value="">Select Semester</option>
        {semesters.map((sem) => (
          <option key={sem.id} value={sem.id}>
            {sem.name} — {sem.year?.name}
          </option>
        ))}
      </select>

      {/* Subject input */}
      <input
        type="text"
        placeholder="Subject name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* Add button */}
      <button onClick={addSubject}>Add Subject</button>

      {/* Subjects list */}
      <div className="admin-list">
        {subjects.length === 0 && <p>No subjects found</p>}

        {subjects.map((sub) => (
          <div key={sub.id} className="admin-row">
            <span>
              {sub.name} (
              {sub.semester?.name} — {sub.semester?.year?.name})
            </span>

            {isAdmin && (
              <button
                className="delete-btn"
                onClick={() => deleteSubject(sub.id)}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageSubjects;
