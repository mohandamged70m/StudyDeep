export function splitIntoChunks(text: string, maxChunkSize = 1500): string[] {
  const paragraphs = text.split(/\n\s*\n/);
  const chunks: string[] = [];
  let current = "";

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;
    if ((current + "\n\n" + trimmed).length > maxChunkSize && current) {
      chunks.push(current.trim());
      current = trimmed;
    } else {
      current += (current ? "\n\n" : "") + trimmed;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}
