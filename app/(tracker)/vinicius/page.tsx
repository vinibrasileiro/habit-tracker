import { ProgressHeader } from "@/components/header/ProgressHeader";
import { ResponsiveTrackerView } from "@/components/layout/ResponsiveTrackerView";

export default function ViniciusPage() {
  return (
    <>
      <ProgressHeader personIds={["vinicius"]} />
      <ResponsiveTrackerView personId="vinicius" />
    </>
  );
}
