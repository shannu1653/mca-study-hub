import { useEffect, useState, useRef } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import "../../styles/adminUpload.css";
import { uploadPDF } from "../../utils/supabaseUpload";

function AdminUpload() {
  const [years, setYears] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  /* LOAD YEARS */
  useEffect(() => {
    api.get("/notes/years/")
      .then(res => setYears(res.data))
      .catch(() => setYears([]));
  }, []);

  /* LOAD SEMESTERS */
  useEffect(() => {
    if (!selectedYear) {
      setSemesters([]);
      return;
    }
    api.get(`/notes/semesters/?year=${selectedYear}`)
      .then(res => setSemesters(res.data))
      .catch(() => setSemesters([]));
  }, [selectedYear]);

  /* LOAD SUBJECTS */
  useEffect(() => {
    if (!selectedSemester) {
      setSubjects([]);
      return;
    }
    api.get(`/notes/subjects/?semester=${selectedSemester}`)
      .then(res => setSubjects(res.data))
      .catch(() => setSubjects([]));
  }, [selectedSemester]);

  /* UPLOAD */
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedYear || !selectedSemester || !selectedSubject || !title || !file) {
      toast.error("All fields required");
      return;
    }

    setLoading(true);

    try {
      const pdfUrl = await uploadPDF(file);

      if (!pdfUrl) {
        throw new Error("Supabase upload failed");
      }

      await api.post("/notes/", {
        title,
        subject_id: selectedSubject,
        pdf_url: pdfUrl,
      });

      toast.success("Note uploaded");

      setTitle("");
      setFile(null);
      setSelectedYear("");
      setSelectedSemester("");
      setSelectedSubject("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-card">
        <h2>Upload Notes</h2>
        <p>Add MCA study material (PDF)</p>

        <form onSubmit={handleUpload}>
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="">Select Year</option>
            {years.map(y => (
              <option key={y.id} value={y.id}>{y.name}</option>
            ))}
          </select>

          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            disabled={!selectedYear}
          >
            <option value="">Select Semester</option>
            {semesters.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={!selectedSemester}
          >
            <option value="">Select Subject</option>
            {subjects.map(sub => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button disabled={loading}>
            {loading ? "Uploading..." : "Upload Note"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminUpload;
