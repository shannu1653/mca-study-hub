import { useEffect, useState, useRef } from "react";
import Layout from "../../layout/Layout";
import api from "../../api/axios";
import toast from "react-hot-toast";
import "../../styles/adminUpload.css";
import { uploadPDF } from "../../utils/supabaseUpload";

function AdminUpload() {
  const token = localStorage.getItem("access");
  const isAdmin = localStorage.getItem("is_admin") === "true";

  useEffect(() => {
    if (!token || !isAdmin) {
      window.location.href = "/login";
    }
  }, [token, isAdmin]);

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

  /* ===== LOAD DATA ===== */
  useEffect(() => {
    api.get("notes/years/")
      .then(res => setYears(res.data))
      .catch(() => toast.error("Failed to load years"));
  }, []);

  useEffect(() => {
    if (!selectedYear) return setSemesters([]);
    api.get(`notes/semesters/?year=${selectedYear}`)
      .then(res => setSemesters(res.data));
  }, [selectedYear]);

  useEffect(() => {
    if (!selectedSemester) return setSubjects([]);
    api.get(`notes/subjects/?semester=${selectedSemester}`)
      .then(res => setSubjects(res.data));
  }, [selectedSemester]);

  /* ===== FILE HANDLERS ===== */
  const handleFile = (file) => {
    if (!file) return;
    if (file.size > 30 * 1024 * 1024) {
      toast.error("PDF must be under 30MB");
      return;
    }
    setFile(file);
  };

  /* ===== UPLOAD ===== */
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedYear || !selectedSemester || !selectedSubject || !title || !file) {
      toast.error("All fields are required");
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

      toast.success("Note uploaded successfully");

      setSelectedYear("");
      setSelectedSemester("");
      setSelectedSubject("");
      setTitle("");
      setFile(null);
      setSemesters([]);
      setSubjects([]);

      fileInputRef.current.value = "";
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
          <h2>📤 Upload Notes</h2>
          <p className="subtitle">PDF only · Max 30MB</p>

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
              <option value="">Select Subject</option>
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

            {/* DRAG & DROP */}
            <div
              className="drop-zone"
              onClick={() => fileInputRef.current.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFile(e.dataTransfer.files[0]);
              }}
            >
              {file ? (
                <p>📄 {file.name}</p>
              ) : (
                <p>Drag & drop PDF here or click</p>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              hidden
              onChange={e => handleFile(e.target.files[0])}
            />

            <button disabled={loading} className="upload-btn">
              {loading ? "Uploading…" : "Upload Note"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default AdminUpload;
