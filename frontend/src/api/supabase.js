import { createClient } from "@supabase/supabase-js";

/* ================= SUPABASE CONFIG ================= */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

/* ================= UPLOAD PDF ================= */
export const uploadPDF = async (file) => {
  if (!file) {
    throw new Error("No file selected");
  }

  /* ✅ Allow only PDF */
  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files are allowed");
  }

  /* ✅ Allow up to 50MB */
  const MAX_SIZE = 50 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error("PDF size must be under 50MB");
  }

  /* ✅ Clean filename (VERY IMPORTANT) */
  const safeName = file.name
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_.-]/g, "");

  /* ✅ Always upload inside a folder */
  const filePath = `pdfs/${Date.now()}_${safeName}`;

  /* ✅ Upload */
  const { error } = await supabase.storage
    .from("notes")
    .upload(filePath, file, {
      contentType: "application/pdf",
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Supabase upload error:", error.message);
    throw error;
  }

  /* ✅ Get public URL */
  const { data } = supabase.storage
    .from("notes")
    .getPublicUrl(filePath);

  return data.publicUrl;
};
