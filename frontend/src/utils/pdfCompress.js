import { PDFDocument } from "pdf-lib";

/**
 * Compress PDF by re-saving it
 * Reduces metadata + optimizes structure
 */
export const compressPDF = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);

  const compressedBytes = await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });

  return new File([compressedBytes], file.name, {
    type: "application/pdf",
  });
};
