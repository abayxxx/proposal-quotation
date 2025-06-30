import { Document, Packer, Paragraph } from "docx";
import { saveAs } from "file-saver";

const docxConverter = async (content: string, filename: string) => {
  // Convert result to DOCX

  const paragraphs = content
    .split(/\n/)
    .map((line) => new Paragraph(line.trim()));

  const doc = new Document({ sections: [{ children: paragraphs }] });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, filename || "proposal.docx");
  });
};

export default docxConverter;
