import { create } from "zustand";
import type { Source } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface SourceState {
  sources: Source[];
  isLoading: boolean;
  error: string | null;
  fetchSources: (notebookId: string) => Promise<void>;
  addSource: (notebookId: string, input: { type: string; title: string; content?: string; file?: File; url?: string }) => Promise<Source | null>;
  deleteSource: (id: string) => Promise<void>;
}

export const useSourceStore = create<SourceState>((set, get) => ({
  sources: [],
  isLoading: false,
  error: null,

  fetchSources: async (notebookId: string) => {
    set({ isLoading: true, error: null });
    const supabase = createClient();
    const { data, error } = await supabase
      .from("sources")
      .select("*")
      .eq("notebook_id", notebookId)
      .order("created_at", { ascending: false });
    if (error) {
      set({ error: error.message, isLoading: false });
      return;
    }
    set({ sources: data ?? [], isLoading: false });
  },

  addSource: async (notebookId, input) => {
    set({ error: null });

    if (input.file) {
      const supabase = createClient();
      const ext = input.file.name.split(".").pop();
      const filePath = `${notebookId}/${Date.now()}-${input.file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("source-files")
        .upload(filePath, input.file);

      if (uploadError) {
        set({ error: uploadError.message });
        return null;
      }

      const { data: sourceData, error: insertError } = await supabase
        .from("sources")
        .insert({
          notebook_id: notebookId,
          type: "pdf",
          title: input.title,
          storage_path: filePath,
          metadata: { size: `${(input.file.size / 1024).toFixed(0)} KB` },
        })
        .select()
        .single();

      if (insertError) {
        set({ error: insertError.message });
        return null;
      }

      set((s) => ({ sources: [sourceData, ...s.sources] }));

      // Trigger processing in background
      fetch(`/api/notebooks/${notebookId}/sources/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceId: sourceData.id, type: "pdf" }),
      }).catch(() => {});

      return sourceData;
    }

    const supabase = createClient();
    const type = input.url ? "youtube" : "text";

    const body: Record<string, string> = {
      notebook_id: notebookId,
      type,
      title: input.title,
    };
    if (input.content) body.raw_content = input.content;
    if (input.url) {
      body.metadata = JSON.stringify({ url: input.url });
    }

    const { data, error } = await supabase
      .from("sources")
      .insert(body)
      .select()
      .single();

    if (error) {
      set({ error: error.message });
      return null;
    }

    set((s) => ({ sources: [data, ...s.sources] }));

    fetch(`/api/notebooks/${notebookId}/sources/process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sourceId: data.id, type, url: input.url }),
    }).catch(() => {});

    return data;
  },

  deleteSource: async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("sources").delete().eq("id", id);
    if (error) {
      set({ error: error.message });
      return;
    }
    set((s) => ({ sources: s.sources.filter((src) => src.id !== id) }));
  },
}));
