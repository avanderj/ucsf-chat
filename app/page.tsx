"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { VersaChatWidget } from "@/components/VersaChatWidget";
import { buttonVariants } from "@/components/ui/Button";
import { demoPageContent } from "@/lib/versa-chat-config";

export default function Home() {
  const [hasAccess, setHasAccess] = useState(false);
  const activePage = demoPageContent.landing;

  return (
    <div className="relative w-full">
      <div className="flex min-h-[72px] w-full flex-wrap items-center justify-center gap-3 bg-[#007242] px-4 py-4 text-sm tracking-wide text-white shadow-md">
        <span className="font-semibold uppercase">UCSF chatbot demo</span>
        <span className="hidden sm:inline opacity-40">|</span>
        <span className="font-light text-white/80">For demonstration purposes only. Content is illustrative and does not represent live data.</span>
        <Link
          href="/annotated-tour"
          className={buttonVariants({ variant: "secondaryDark", size: "sm" })}
        >
          View Annotated Tour
        </Link>
        <Link
          href="/design-language"
          className={buttonVariants({ variant: "secondaryDark", size: "sm" })}
        >
          Chatbot Design Language
        </Link>
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

      </div>
      <VersaChatWidget
        contextKey="landing"
        hasAccess={hasAccess}
        onAuthenticate={() => setHasAccess(true)}
        suggestedPrompts={activePage.prompts}
      />
    </div>
  );
}
