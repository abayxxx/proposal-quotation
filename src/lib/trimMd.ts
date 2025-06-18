const markdownToTextFast = (md: string): string =>
  md
    .replace(/[#*_`>~\-]/g, "") // remove markdown symbols
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // remove link URLs but keep text
    .replace(/\n{2,}/g, "\n\n")
    .trim();

export const trimMd = (md: string): string => {
  // Remove markdown symbols and trim whitespace
  const trimmed = markdownToTextFast(md);

  // If the string is empty after trimming, return a placeholder
  return trimmed || "No content provided.";
};
