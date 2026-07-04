import { MemorizeSession } from "@/components/MemorizeSession";
import { GamificationPanel } from "@/components/GamificationPanel";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI Hifz Memorization & Review",
  description:
    "Memorize the Quran with AI-powered spaced repetition, smart tests, verse practice, and microphone recitation feedback. Track Hifz progress on WabilHuda.",
  path: "/memorize",
  keywords: ["Hifz app", "Quran memorization", "spaced repetition Quran", "AI Hifz coach"],
});

export default function MemorizePage() {
  return (
    <div className="space-y-6">
      <GamificationPanel compact />
      <MemorizeSession />
    </div>
  );
}
