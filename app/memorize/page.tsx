import { MemorizeSession } from "@/components/MemorizeSession";
import { GamificationPanel } from "@/components/GamificationPanel";

export const metadata = {
  title: "Hifz Review — WabilHuda",
};

export default function MemorizePage() {
  return (
    <div className="space-y-6">
      <GamificationPanel compact />
      <MemorizeSession />
    </div>
  );
}
