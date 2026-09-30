"use client";

export function QuickCheckinButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-5 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper shadow-lg active:scale-95"
    >
      + CHECK-IN DE HOJE
    </button>
  );
}
