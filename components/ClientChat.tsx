"use client";

import dynamic from "next/dynamic";

const ChatAssistant = dynamic(
  () => import("@/components/ChatAssistant").then((m) => m.ChatAssistant),
  { ssr: false },
);

export function ClientChat() {
  return <ChatAssistant />;
}
