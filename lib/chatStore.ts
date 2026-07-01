"use client";

import { create } from "zustand";
import type { AyahContext, ChatMessage } from "./ai";

interface ChatState {
  open: boolean;
  context: AyahContext | null;
  messages: ChatMessage[];
  setOpen: (open: boolean) => void;
  setContext: (context: AyahContext | null) => void;
  openWith: (context: AyahContext, prompt?: string) => void;
  pushMessage: (message: ChatMessage) => void;
  replaceLast: (content: string) => void;
  clear: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  open: false,
  context: null,
  messages: [],
  setOpen: (open) => set({ open }),
  setContext: (context) => set({ context }),
  openWith: (context, prompt) =>
    set((state) => ({
      open: true,
      context,
      messages: prompt
        ? [...state.messages, { role: "user", content: prompt }]
        : state.messages,
    })),
  pushMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  replaceLast: (content) =>
    set((state) => {
      const next = [...state.messages];
      if (next.length > 0) next[next.length - 1] = { role: "assistant", content };
      return { messages: next };
    }),
  clear: () => set({ messages: [] }),
}));
