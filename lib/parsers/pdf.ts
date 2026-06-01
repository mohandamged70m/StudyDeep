export async function parsePDF(buffer: Buffer): Promise<{ text: string; pages: number }> {
  const { PDFParse } = await import("pdf-parse");
  const doc = new PDFParse({ data: buffer });
  const result = await doc.getText();
  await doc.destroy();
  return { text: result.text, pages: result.pages.length };
}
