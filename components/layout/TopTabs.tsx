"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/vinicius", label: "👤 Vinicius" },
  { href: "/camila", label: "👤 Camila" },
  { href: "/nosso-desafio", label: "👥 Nosso Desafio" },
];

export function TopTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 border-b border-line px-3 pt-2">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={[
              "rounded-t-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "border border-b-0 border-line bg-paper text-ink"
                : "text-ink-muted hover:text-ink",
            ].join(" ")}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
