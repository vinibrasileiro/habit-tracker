import { ProgressHeader } from "@/components/header/ProgressHeader";
import { ResponsiveTrackerView } from "@/components/layout/ResponsiveTrackerView";

export default function CamilaPage() {
  return (
    <>
      <ProgressHeader personIds={["camila"]} />
      <ResponsiveTrackerView personId="camila" />
    </>
  );
}
