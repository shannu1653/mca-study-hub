import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadPDF = async (file) => {
  if (!file) throw new Error("No file selected");

  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files allowed");
  }

  // ✅ sanitize name
  const safeName = file.name.replace(/\s+/g, "_").replace(/[()]/g, "");
  const fileName = `${Date.now()}_${safeName}`;

  // ✅ folder path is REQUIRED
  const filePath = `pdfs/${fileName}`;

  const { error } = await supabase.storage
    .from("notes")
    .upload(filePath, file, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (error) {
    console.error("Upload error:", error);
    throw error;
  }

  const { data } = supabase.storage
    .from("notes")
    .getPublicUrl(filePath);

  return data.publicUrl;
};
