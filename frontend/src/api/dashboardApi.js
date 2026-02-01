import api from "./axios";

/**
 * User dashboard data is derived from NOTES
 * because backend has no dashboard endpoint
 */
export const getUserDashboardStats = async () => {
  const res = await api.get("notes/");

  const notes = res.data || [];

  const subjects = new Set();
  const semesters = new Set();

  notes.forEach((n) => {
    if (n.subject) {
      subjects.add(n.subject.id);
      if (n.subject.semester) {
        semesters.add(n.subject.semester.id);
      }
    }
  });

  return {
    total_notes: notes.length,
    bookmarks: JSON.parse(localStorage.getItem("bookmarks"))?.length || 0,
    subjects: subjects.size,
    semesters: semesters.size,
  };
};
