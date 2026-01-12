import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

function ManageSemesters() {
  const [years, setYears] = useState([]);
  const [semesters, setSemesters] = useState([]);

  const [selectedYear, setSelectedYear] = useState(""); // ✅ FIX
  const [name, setName] = useState("");

  /* Load data */
  useEffect(() => {
    loadYears();
    loadSemesters();
  }, []);

  const loadYears = async () => {
    try {
      const res = await api.get("notes/years/");
      setYears(res.data);
    } catch {
      toast.error("Failed to load years");
    }
  };

  const loadSemesters = async () => {
    try {
      const res = await api.get("notes/semesters/");
      setSemesters(res.data);
    } catch {
      toast.error("Failed to load semesters");
    }
  };

  /* Add semester */
  const addSemester = async () => {
    if (!selectedYear || !name) {
      toast.error("Select year and enter semester name");
      return;
    }

    try {
      await api.post("notes/semesters/", {
        name,
        year: selectedYear, // ✅ IMPORTANT
      });

      toast.success("Semester added");
      setName("");
      loadSemesters();
    } catch (err) {
      console.error(err.response?.data);
      toast.error("Failed to add semester");
    }
  };

  /* Delete semester */
  const deleteSemester = async (id) => {
    try {
      await api.delete(`notes/semesters/${id}/`);
      toast.success("Semester deleted");
      loadSemesters();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="admin-page">
      <h2>Manage Semesters</h2>

      {/* Add form */}
      <div className="form-row">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="">Select Year</option>
          {years.map((y) => (
            <option key={y.id} value={y.id}>
              {y.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Semester name (e.g. Semester 1)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button onClick={addSemester}>Add Semester</button>
      </div>

      {/* List */}
      {semesters.map((s) => (
        <div key={s.id} className="list-item">
          <span>
            {s.name} — {s.year?.name}
          </span>
          <button onClick={() => deleteSemester(s.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default ManageSemesters;
