import { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import api from "../../api/axios";
import toast from "react-hot-toast";
import "../../styles/adminUpload.css";
import { uploadPDF } from "../../utils/supabaseUpload";

function AdminUpload() {
  /* Backend data */
  const [years, setYears] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);

  /* Form state */
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD YEARS ================= */
  useEffect(() => {
    fetchYears();
  }, []);

  const fetchYears = async () => {
    try {
      const res = await api.get("notes/years/");
      setYears(res.data);
    } catch {
      toast.error("Failed to load years");
    }
  };

  /* ================= LOAD SEMESTERS ================= */
  useEffect(() => {
    if (selectedYear) {
      fetchSemesters(selectedYear);
      setSelectedSemester("");
      setSelectedSubject("");
      setSubjects([]);
    }
  }, [selectedYear]);

  const fetchSemesters = async (yearId) => {
    try {
      const res = await api.get("notes/semesters/");
      const filtered = res.data.filter(
        (s) => s.year === Number(yearId)
      );
      setSemesters(filtered);
    } catch {
      toast.error("Failed to load semesters");
    }
  };

  /* ================= LOAD SUBJECTS ================= */
  useEffect(() => {
    if (selectedSemester) {
      fetchSubjects(selectedSemester);
      setSelectedSubject("");
    }
  }, [selectedSemester]);

  const fetchSubjects = async (semesterId) => {
    try {
      const res = await api.get(
        `notes/subjects/?semester=${semesterId}`
      );
      setSubjects(res.data);
    } catch {
      toast.error("Failed to load subjects");
    }
  };

  /* ================= UPLOAD ================= */
  const handleUpload = async (e) => {
    e.preventDefault();

    if (
      !selectedYear ||
      !selectedSemester ||
      !selectedSubject ||
      !title ||
      !file
    ) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const pdfUrl = await uploadPDF(file);

      await api.post("notes/", {
        title,
        subject: selectedSubject,
        pdf_url: pdfUrl,
      });

      toast.success("Note uploaded successfully");

      /* Reset form */
      setSelectedYear("");
      setSelectedSemester("");
      setSelectedSubject("");
      setTitle("");
      setFile(null);
      setSemesters([]);
      setSubjects([]);
    } catch {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="upload-page">
        <div className="upload-card">
          <h2>Upload Notes</h2>
          <p>Add new MCA study material</p>

          <form onSubmit={handleUpload}>
            {/* YEAR */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">Select MCA Year</option>
              {years.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.name}
                </option>
              ))}
            </select>

            {/* SEMESTER */}
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              disabled={!selectedYear}
            >
              <option value="">Select Semester</option>
              {semesters.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* SUBJECT */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              disabled={!selectedSemester}
            >
              <option value="">
                {selectedSemester
                  ? "Select Subject"
                  : "Select Semester first"}
              </option>

              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>

            {selectedSemester && subjects.length === 0 && (
              <p className="hint-text">
                No subjects found for selected semester
              </p>
            )}

            {/* TITLE */}
            <input
              type="text"
              placeholder="Note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* FILE */}
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
            />

            {/* SUBMIT */}
            <button type="submit" disabled={loading}>
              {loading ? "Uploading..." : "Upload Note"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default AdminUpload;
