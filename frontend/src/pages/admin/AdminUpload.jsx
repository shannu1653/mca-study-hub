import { useEffect, useState, useRef } from "react";
import Layout from "../../layout/Layout";
import api from "../../api/axios";
import toast from "react-hot-toast";
import "../../styles/adminUpload.css";
import { uploadPDF } from "../../utils/supabaseUpload";

function AdminUpload() {
  /* ================= AUTH GUARD ================= */
  const token = localStorage.getItem("access");
  const isAdmin = localStorage.getItem("is_admin") === "true";

  useEffect(() => {
    if (!token || !isAdmin) {
      window.location.href = "/login";
    }
  }, [token, isAdmin]);

  /* ================= DATA ================= */
  const [years, setYears] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);

  /* ================= FORM ================= */
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  /* ================= LOAD YEARS ================= */
  useEffect(() => {
    api.get("notes/years/")
      .then(res => setYears(res.data))
      .catch(() => toast.error("Failed to load years"));
  }, []);

  /* ================= LOAD SEMESTERS ================= */
  useEffect(() => {
    if (!selectedYear) {
      setSemesters([]);
      setSelectedSemester("");
      setSelectedSubject("");
      return;
    }

    api.get(`notes/semesters/?year=${selectedYear}`)
      .then(res => setSemesters(res.data))
      .catch(() => toast.error("Failed to load semesters"));
  }, [selectedYear]);

  /* ================= LOAD SUBJECTS ================= */
  useEffect(() => {
    if (!selectedSemester) {
      setSubjects([]);
      setSelectedSubject("");
      return;
    }

    api.get(`notes/subjects/?semester=${selectedSemester}`)
      .then(res => setSubjects(res.data))
      .catch(() => toast.error("Failed to load subjects"));
  }, [selectedSemester]);

  /* ================= UPLOAD ================= */
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedYear || !selectedSemester || !selectedSubject || !title || !file) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const pdfUrl = await uploadPDF(file);

      await api.post("notes/", {
        title: title.trim(),
        subject: selectedSubject,
        pdf_url: pdfUrl,
      });

      toast.success("Note uploaded successfully ✅");

      setSelectedYear("");
      setSelectedSemester("");
      setSelectedSubject("");
      setTitle("");
      setFile(null);
      setSemesters([]);
      setSubjects([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="upload-wrapper">
        <div className="upload-card">
          <h2>Upload Notes</h2>
          <p className="subtitle">Add MCA study material (PDF only)</p>

          <form onSubmit={handleUpload}>
            <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
              <option value="">Select MCA Year</option>
              {years.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}
            </select>

            <select
              value={selectedSemester}
              onChange={e => setSelectedSemester(e.target.value)}
              disabled={!selectedYear}
            >
              <option value="">Select Semester</option>
              {semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>

            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              disabled={!selectedSemester}
            >
              <option value="">
                {selectedSemester ? "Select Subject" : "Select semester first"}
              </option>
              {subjects.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Note title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={e => setFile(e.target.files[0])}
            />

            {file && (
              <p className="file-info">
                📄 {(file.size / (1024 * 1024)).toFixed(2)} MB selected
              </p>
            )}

            <p className="upload-hint">
              ⚠️ Only PDF · Max 50MB
            </p>

            <button
              type="submit"
              disabled={loading}
              className="upload-btn"
            >
              {loading ? "Uploading..." : "Upload Note"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default AdminUpload;
