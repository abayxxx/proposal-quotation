import { Paragraph, TextRun, HeadingLevel } from "docx";
import { marked } from "marked";

// Convert a markdown string into structured docx Paragraphs
export const markdownToDocxParagraphs = (markdown: string) => {
  const tokens = marked.lexer(markdown);
  const docParagraphs: Paragraph[] = [];

  tokens.forEach((token) => {
    if (token.type === "heading") {
      docParagraphs.push(
        new Paragraph({
          text: token.text,
          heading:
            token.depth === 1
              ? HeadingLevel.HEADING_1
              : token.depth === 2
              ? HeadingLevel.HEADING_2
              : HeadingLevel.HEADING_3,
        })
      );
    } else if (token.type === "paragraph") {
      docParagraphs.push(
        new Paragraph({
          children: [new TextRun({ text: token.text, break: 1 })],
        })
      );
    } else if (token.type === "list") {
      token.items.forEach((item: any) => {
        docParagraphs.push(
          new Paragraph({
            text: item.text,
            bullet: { level: 0 },
          })
        );
      });
    } else if (token.type === "strong") {
      docParagraphs.push(
        new Paragraph({
          children: [new TextRun({ text: token.text, bold: true })],
        })
      );
    } else if (token.type === "text") {
      docParagraphs.push(new Paragraph({ text: token.text }));
    } else if (token.type === "hr") {
      docParagraphs.push(new Paragraph({ text: "—".repeat(20) }));
    }
  });

  return docParagraphs;
};

export const docToParagraph = (markdown: string): Paragraph[] => {
  // Convert markdown to docx paragraphs
  return markdownToDocxParagraphs(markdown);
};
