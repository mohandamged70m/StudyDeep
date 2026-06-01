import { create } from "zustand";
import type { Notebook, CreateNotebookInput } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface NotebookState {
  notebooks: Notebook[];
  isLoading: boolean;
  error: string | null;
  fetchNotebooks: () => Promise<void>;
  createNotebook: (input: CreateNotebookInput) => Promise<Notebook | null>;
  updateNotebook: (id: string, updates: Partial<Notebook>) => Promise<void>;
  deleteNotebook: (id: string) => Promise<void>;
}

export const useNotebookStore = create<NotebookState>((set, get) => ({
  notebooks: [],
  isLoading: false,
  error: null,

  fetchNotebooks: async () => {
    set({ isLoading: true, error: null });
    const supabase = createClient();
    const { data, error } = await supabase
      .from("notebooks")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      set({ error: error.message, isLoading: false });
      return;
    }
    set({ notebooks: data ?? [], isLoading: false });
  },

  createNotebook: async (input: CreateNotebookInput) => {
    const supabase = createClient();
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return null;

    const { data, error } = await supabase
      .from("notebooks")
      .insert({
        title: input.title,
        color: input.color ?? "#D4891A",
        emoji: input.emoji ?? "📚",
        user_id: user.user.id,
      })
      .select()
      .single();

    if (error) {
      set({ error: error.message });
      return null;
    }

    set((state) => ({ notebooks: [data, ...state.notebooks] }));
    return data;
  },

  updateNotebook: async (id: string, updates: Partial<Notebook>) => {
    const supabase = createClient();
    const { error } = await supabase.from("notebooks").update(updates).eq("id", id);
    if (error) {
      set({ error: error.message });
      return;
    }
    set((state) => ({
      notebooks: state.notebooks.map((nb) =>
        nb.id === id ? { ...nb, ...updates } : nb
      ),
    }));
  },

  deleteNotebook: async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("notebooks").delete().eq("id", id);
    if (error) {
      set({ error: error.message });
      return;
    }
    set((state) => ({
      notebooks: state.notebooks.filter((nb) => nb.id !== id),
    }));
  },
}));
