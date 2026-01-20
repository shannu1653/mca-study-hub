import { createClient } from "@supabase/supabase-js";
import { compressPDF } from "./pdfCompress";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const MAX_SIZE = 50 * 1024 * 1024; // 50MB

export const uploadPDF = async (file) => {
  if (!file) throw new Error("No file selected");

  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files allowed");
  }

  if (file.size > MAX_SIZE) {
    throw new Error("PDF must be less than 50 MB");
  }

  // 🔹 Compress PDF
  const compressedFile = await compressPDF(file);

  // 🔹 Safe filename
  const safeName = compressedFile.name
    .replace(/\s+/g, "_")
    .replace(/[()]/g, "");

  const filePath = `pdfs/${Date.now()}_${safeName}`;

  const { error } = await supabase.storage
    .from("notes")
    .upload(filePath, compressedFile, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from("notes")
    .getPublicUrl(filePath);

  return data.publicUrl;
};
