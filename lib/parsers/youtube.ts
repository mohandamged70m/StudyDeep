export async function getYouTubeTranscript(videoId: string): Promise<string> {
  const { YoutubeTranscript } = await import("youtube-transcript");
  const transcript = await YoutubeTranscript.fetchTranscript(videoId);
  return transcript.map((t: { text: string }) => t.text).join(" ");
}

export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}
