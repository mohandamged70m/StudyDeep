import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parsePDF } from "@/lib/parsers/pdf";
import { getYouTubeTranscript, extractYouTubeId } from "@/lib/parsers/youtube";
import { splitIntoChunks } from "@/lib/parsers/text";
import { embedBatch } from "@/lib/ai/gemini";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sourceId, type, url } = await request.json();

  const { data: source, error: fetchError } = await supabase
    .from("sources")
    .select("*")
    .eq("id", sourceId)
    .single();

  if (fetchError || !source) {
    return NextResponse.json({ error: "Source not found" }, { status: 404 });
  }

  let text = source.raw_content || "";
  let pages = 0;

  try {
    if (type === "pdf" && source.storage_path) {
      const { data: fileData } = await supabase.storage
        .from("source-files")
        .download(source.storage_path);

      if (fileData) {
        const buffer = Buffer.from(await fileData.arrayBuffer());
        const result = await parsePDF(buffer);
        text = result.text;
        pages = result.pages;
      }
    }

    if (type === "youtube" && url) {
      const videoId = extractYouTubeId(url);
      if (videoId) {
        text = await getYouTubeTranscript(videoId);
      }
    }

    if (!text) {
      return NextResponse.json({ error: "No content extracted" }, { status: 400 });
    }

    // Update source with raw text + metadata
    const metadata: Record<string, unknown> = { ...(source.metadata as Record<string, unknown> || {}) };
    metadata.word_count = text.split(/\s+/).length;
    if (pages) metadata.pages = pages;

    await supabase.from("sources").update({ raw_content: text, metadata }).eq("id", sourceId);

    // Chunk + embed
    const chunks = splitIntoChunks(text);
    const embeddings = await embedBatch(chunks);

    const chunkRows = chunks.map((content, i) => ({
      source_id: sourceId,
      notebook_id: id,
      content,
      chunk_index: i,
      embedding: embeddings[i],
    }));

    const { error: insertError } = await supabase.from("chunks").insert(chunkRows);
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Update source_count on notebook
    const { count } = await supabase
      .from("sources")
      .select("*", { count: "exact", head: true })
      .eq("notebook_id", id);

    await supabase
      .from("notebooks")
      .update({ source_count: count, updated_at: new Date().toISOString() })
      .eq("id", id);

    return NextResponse.json({ success: true, chunks: chunks.length });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Processing failed" },
      { status: 500 }
    );
  }
}
