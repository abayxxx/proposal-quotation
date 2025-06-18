import { jsPDF } from "jspdf";
import { trimMd } from "@/lib/trimMd";

const pdfConverter = {
  convertToPDF: async (
    htmlContent: string,
    options?: {
      format?: string;
      landscape?: boolean;
      fontSize?: number;
      fontFamily?: string;
      fontStyle?: string;
      unit?: "pt" | "mm" | "cm" | "in";
    },
    fileName?: string
  ) => {
    const trimmedResult = trimMd(htmlContent);

    // Convert result to PDF
    const doc = new jsPDF({
      unit: options?.unit || "pt", // better layout control with points
      format: options?.format || "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    const maxLineWidth = pageWidth - margin * 2;
    const lineHeight = 20;
    let y = margin;

    doc.setFont(
      options?.fontFamily || "Helvetica",
      options?.fontStyle || "normal"
    );
    doc.setFontSize(options?.fontSize || 10); // Smaller font size (default is 16)

    // Split the text into wrapped lines
    const lines = doc.splitTextToSize(trimmedResult, maxLineWidth);

    // Add each line and handle page breaks
    lines.forEach((line: string) => {
      if (y + lineHeight > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    });

    doc.save(fileName || "proposal.pdf");
  },
};

export default pdfConverter;
