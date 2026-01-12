import api from "./axios";

/* YEARS */
export const getYears = () => api.get("notes/years/");
export const createYear = (data) => api.post("notes/years/", data);
export const deleteYear = (id) => api.delete(`notes/years/${id}/`);

/* SEMESTERS */
export const getSemesters = (yearId) =>
  api.get(`notes/semesters/?year=${yearId}`);

export const createSemester = (data) =>
  api.post("notes/semesters/", data);

export const deleteSemester = (id) =>
  api.delete(`notes/semesters/${id}/`);

/* SUBJECTS */
export const getSubjects = (semesterId) =>
  api.get(`notes/subjects/?semester=${semesterId}`);

export const createSubject = (data) =>
  api.post("notes/subjects/", data);

export const deleteSubject = (id) =>
  api.delete(`notes/subjects/${id}/`);
