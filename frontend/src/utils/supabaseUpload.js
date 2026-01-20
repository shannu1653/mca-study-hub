import { createClient } from "@supabase/supabase-js";

/* ================= SUPABASE CONFIG ================= */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

/* ================= UPLOAD PDF ================= */
export const uploadPDF = async (file) => {
  // ✅ Validate file type
  if (!file || file.type !== "application/pdf") {
    throw new Error("Only PDF files are allowed");
  }

  // ✅ Validate file size (10MB)
  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error("File size must be less than 10MB");
  }

  // ✅ Safe unique filename (works everywhere)
  const uniqueId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2);

  const filePath = `${Date.now()}_${uniqueId}.pdf`;

  // ✅ Upload to Supabase bucket (NO folder name)
  const { error } = await supabase.storage
    .from("notes") // bucket name
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: "application/pdf",
    });

  if (error) {
    console.error("Supabase upload error:", error);
    throw error;
  }

  // ✅ Get public URL
  const { data } = supabase.storage
    .from("notes")
    .getPublicUrl(filePath);

  if (!data?.publicUrl) {
    throw new Error("Failed to get public URL");
  }

  return data.publicUrl;
};
