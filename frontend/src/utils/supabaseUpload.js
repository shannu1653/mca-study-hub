import { createClient } from "@supabase/supabase-js";

/* ================= SUPABASE CONFIG ================= */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

/* ================= UPLOAD PDF ================= */
export const uploadPDF = async (file) => {
  // ✅ Validate file type
  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files are allowed");
  }

  // ✅ Validate file size (max 10MB)
  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error("File size must be less than 10MB");
  }

  // ✅ Unique file path
  const filePath = `${Date.now()}_${crypto.randomUUID()}.pdf`;

  // ✅ Upload
  const { error } = await supabase.storage
    .from("notes")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  // ✅ Get public URL
  const { data } = supabase.storage
    .from("notes")
    .getPublicUrl(filePath);

  return data.publicUrl;
};
