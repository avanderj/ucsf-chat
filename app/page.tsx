"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { VersaChatWidget } from "@/components/VersaChatWidget";
import { demoPageContent, type PageKey } from "@/lib/versa-chat-config";

export default function Home() {
  const [hasAccess, setHasAccess] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageKey>("landing");
  const activePage = demoPageContent[currentPage];

  const handleOpenOfficeAccessibilityPage = () => {
    setCurrentPage("office-accessibility");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReturnToLandingPage = () => {
    setCurrentPage("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative w-full">
      <div className="flex w-full flex-wrap items-center justify-center gap-2 bg-[#052049] px-4 py-2 text-sm tracking-wide text-white shadow-md">
        <span className="font-semibold uppercase">UCSF chatbot demo</span>
        <Link
          href="/annotated-tour"
          className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-white/18"
        >
          View Annotated Tour
        </Link>
        <span className="hidden sm:inline opacity-40">|</span>
        <span className="font-light text-white/80">For demonstration purposes only. Content is illustrative and does not represent live data.</span>
      </div>
      <div className="relative w-full">
        <Image
          src={activePage.src}
          alt={activePage.alt}
          className="block h-auto w-full"
          width={activePage.width}
          height={activePage.height}
          priority
        />

        {currentPage === "landing" && (
          <button
            type="button"
            onClick={handleOpenOfficeAccessibilityPage}
            className="absolute left-[6.6%] top-[54.2%] z-10 h-[4.8%] w-[22.5%] cursor-pointer appearance-none border-0 bg-transparent p-0"
            aria-label="Open Word, PowerPoint, and Excel accessibility page"
            title="Word, PowerPoint, and Excel Accessibility"
          />
        )}

        {currentPage === "office-accessibility" && (
          <button
            type="button"
            onClick={handleReturnToLandingPage}
            className="absolute left-[10.6%] top-[1.05%] z-10 h-[1.15%] w-[28%] cursor-pointer appearance-none border-0 bg-transparent p-0"
            aria-label="Return to Digital Accessibility Compliance Project page"
            title="Digital Accessibility Compliance Project"
          />
        )}
      </div>
      <VersaChatWidget
        contextKey={currentPage}
        hasAccess={hasAccess}
        onAuthenticate={() => setHasAccess(true)}
        suggestedPrompts={activePage.prompts}
      />
    </div>
  );
}
