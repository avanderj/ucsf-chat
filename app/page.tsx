"use client";

import Image from "next/image";
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
      <div className="bg-[#052049] text-white w-full py-2 flex items-center justify-center gap-2 text-sm tracking-wide shadow-md flex-wrap px-4">
        <span className="font-semibold uppercase">UCSF chatbot demo</span>
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
