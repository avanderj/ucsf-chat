"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useState } from "react";
import {
  BrainCircuit,
  Check,
  ChevronDown,
  Copy,
  Maximize2,
  MessageSquare,
  MessageSquareMore,
  Minimize2,
  Send,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import { VersaChatWidget } from "@/components/VersaChatWidget";
import { demoPageContent } from "@/lib/versa-chat-config";

const colors = [
  { name: "Chat navy", hex: "#052049", usage: "Header, headings, and primary text" },
  { name: "Action blue", hex: "#006BE9", usage: "Primary actions, links, focus, and agent badges" },
  { name: "Send blue", hex: "#3C69D9", usage: "Send message control" },
  { name: "Body blue-gray", hex: "#506380", usage: "Supporting text, labels, and icons" },
  { name: "Prompt gray", hex: "#F2F3F4", usage: "Assistant messages, prompt cards, and input area" },
  { name: "User blue", hex: "#EAF3FF", usage: "User messages and selected agent" },
  { name: "Feedback blue", hex: "#E2F4FC", usage: "Selected feedback state" },
  { name: "White", hex: "#FFFFFF", usage: "Chat surface, input, and reversed text" },
];

const chatbotIcons = [
  { name: "BrainCircuit", Icon: BrainCircuit, use: "Versa assistant identity" },
  { name: "Check", Icon: Check, use: "Selected agent indicator" },
  { name: "ChevronDown", Icon: ChevronDown, use: "Open or close the agent menu" },
  { name: "Copy", Icon: Copy, use: "Copy a message" },
  { name: "Maximize2", Icon: Maximize2, use: "Expand the chat" },
  { name: "MessageSquare", Icon: MessageSquare, use: "Chat identity and launcher" },
  { name: "MessageSquareMore", Icon: MessageSquareMore, use: "Suggested prompt marker" },
  { name: "Minimize2", Icon: Minimize2, use: "Collapse the chat" },
  { name: "Send", Icon: Send, use: "Send a message" },
  { name: "ThumbsDown", Icon: ThumbsDown, use: "Mark a response unhelpful" },
  { name: "ThumbsUp", Icon: ThumbsUp, use: "Mark a response helpful" },
  { name: "X", Icon: X, use: "Close or dismiss a panel" },
];

function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#006BE9]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-[30px] font-semibold tracking-[-0.03em] text-[#052049]">
        {title}
      </h2>
      <p className="mt-4 text-[17px] leading-[1.6] text-[#506380]">{children}</p>
    </div>
  );
}

function ColorSwatch({ name, hex, usage }: (typeof colors)[number]) {
  return (
    <div className="rounded-none bg-[#FBFDFF] p-4">
      <div className="h-16 rounded-none" style={{ backgroundColor: hex }} />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[15px] font-semibold text-[#052049]">{name}</p>
        <code className="text-[13px] text-[#506380]">{hex}</code>
      </div>
      <p className="mt-2 text-[15px] leading-[1.55] text-[#506380]">{usage}</p>
    </div>
  );
}

export default function DesignLanguagePage() {
  const [hasAccess, setHasAccess] = useState(false);
  const activePage = demoPageContent.landing;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#EEF5FF_0%,#F8FBFF_18%,#FFFFFF_60%)] text-[#171717]">
      <section className="border-b border-[#D8E3F2] bg-[#052049] px-6 py-16 text-white md:px-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#7EC2FF]">
            Versa Chat System
          </p>
          <h1 className="mt-4 max-w-4xl text-[44px] font-semibold leading-[0.95] tracking-[-0.04em] md:text-[64px]">
            Design Language
          </h1>
          <p className="mt-6 max-w-3xl text-[17px] leading-[1.6] text-white/80">
            A focused guide to the visual language and interface elements used in the chatbot.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-none border-[3px] border-[#006BE9] bg-transparent px-6 py-2.5 text-[18.66px] font-medium text-white transition-all hover:bg-[#006BE9] hover:text-white active:border-[#052049] active:bg-[#052049] active:text-white focus-visible:bg-[#006BE9] focus-visible:text-white focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#006BE9] focus-visible:outline-offset-[3px]"
            >
              Return to Demo
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-12 md:px-10">
        <div className="mx-auto max-w-6xl space-y-8">
          <section className="rounded-none bg-white p-6 md:p-8">
            <SectionHeading eyebrow="01 / Color" title="A focused, high-contrast palette">
              Navy anchors the experience, blue signals action, and soft cool grays keep conversation content easy to scan.
            </SectionHeading>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {colors.map((color) => <ColorSwatch key={color.hex} {...color} />)}
            </div>
          </section>

          <section className="rounded-none bg-white p-6 md:p-8">
            <SectionHeading eyebrow="02 / Typography" title="One familiar sans-serif family">
              Helvetica Neue, Arial, and Helvetica fallbacks keep content familiar. Size and weight changes distinguish the agent, message, and supporting details.
            </SectionHeading>
            <div className="mt-8 grid gap-3 lg:grid-cols-[minmax(0,1.45fr)_320px] xl:grid-cols-[minmax(0,1.55fr)_360px]">
              <div className="rounded-none bg-[#EAF3FF] p-3 md:p-4">
                <div className="space-y-6 rounded-none bg-white p-5 md:p-6">
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#006BE9]">Agent / 32 px / semibold</p>
                    <p className="mt-3 text-[30px] font-semibold tracking-[-0.03em] text-[#052049]">Digital A11y</p>
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#006BE9]">Message / 16 px / regular</p>
                    <p className="mt-3 text-[17px] leading-[1.6] text-[#101828]">I can help you find clear guidance and relevant resources for this topic.</p>
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#006BE9]">Supporting text / 14 px / medium</p>
                    <p className="mt-3 text-[14px] font-medium text-[#506380]">Accessibility and Compliance Support</p>
                  </div>
                </div>
              </div>
              <div className="rounded-none bg-[#FBFDFF] p-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#006BE9]">Section label / 13 px</p>
                <p className="mt-3 text-sm font-semibold uppercase tracking-[0.08em] text-[#506380]">Suggested prompts</p>
                <p className="mt-6 text-[15px] leading-[1.55] text-[#506380]">
                  Sentence case is used for conversation content. Compact uppercase labels identify metadata and controls.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-none bg-white p-6 md:p-8">
            <SectionHeading eyebrow="03 / Controls" title="Actions stay easy to recognize">
              Controls use direct labels, generous hit areas, and a visible blue focus outline. Primary actions remain visually distinct from utility actions.
            </SectionHeading>
            <div className="mt-8 lg:grid lg:grid-cols-[minmax(0,1.45fr)_320px] lg:gap-6 xl:grid-cols-[minmax(0,1.55fr)_360px]">
              <div className="rounded-none bg-[#EAF3FF] p-3 md:p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex min-h-44 flex-col justify-between rounded-none bg-white p-5">
                    <p className="text-[15px] font-semibold text-[#052049]">Primary action</p>
                    <button type="button" className="w-full rounded-full border-2 border-[#006BE9] bg-transparent px-5 py-3 text-base font-semibold text-[#052049] hover:bg-[#006BE9] hover:text-white active:border-[#052049] active:bg-[#052049] active:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006BE9] focus-visible:outline-offset-2">
                      Log In via MyAccess
                    </button>
                  </div>
                  <div className="flex min-h-44 w-full flex-col justify-between rounded-none bg-[#F2F3F4] p-5 md:col-span-2 md:max-w-[var(--versa-widget-chat-width)]">
                    <p className="text-[15px] font-semibold text-[#052049]">Composer input</p>
                    <div className="flex">
                      <div className="versa-widget-input flex flex-1 items-center border-0 border-l-[6px] border-l-[#8B919A] bg-white text-[#052049]">Ask a question...</div>
                      <button type="button" aria-label="Send message" className="versa-widget-send-button flex flex-shrink-0 items-center justify-center bg-[#3C69D9] text-white hover:bg-[#2F58BE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006BE9] focus-visible:outline-offset-2">
                        <Send className="h-6 w-6" strokeWidth={2.2} />
                      </button>
                    </div>
                  </div>
                  <div className="flex min-h-36 flex-col justify-between rounded-none bg-white p-5 md:col-span-2">
                    <p className="text-[15px] font-semibold text-[#052049]">Response actions</p>
                    <div className="flex items-center gap-2">
                      {[ThumbsUp, ThumbsDown, Copy].map((Icon, index) => (
                        <button key={index} type="button" aria-label={["Helpful", "Not helpful", "Copy"][index]} className={`border p-2 text-[#506380] hover:bg-[#F2F3F4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006BE9] ${index === 0 ? "border-[#178CCB] bg-[#E2F4FC] text-[#052049]" : "border-transparent"}`}>
                          <Icon className="h-4 w-4" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-none bg-white p-5 md:col-span-2">
                    <p className="text-[15px] font-semibold text-[#052049]">Feedback text area / keyboard focus</p>
                    <textarea
                      aria-label="Feedback text area focus state example"
                      readOnly
                      value="Share your thoughts..."
                      className="mt-4 min-h-[120px] w-full resize-none rounded-none border-2 border-gray-100 bg-gray-50 p-4 text-[16px] text-[#667085] outline outline-2 outline-[#006BE9] outline-offset-1"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-3 lg:mt-0">
                <div className="rounded-none bg-[#FBFDFF] p-4">
                  <p className="text-[15px] font-semibold text-[#052049]">Primary action</p>
                  <p className="mt-3 text-[15px] leading-[1.55] text-[#506380]">The login action uses a blue outline, rounded shape, and clear action label.</p>
                </div>
                <div className="rounded-none bg-[#FBFDFF] p-4">
                  <p className="text-[15px] font-semibold text-[#052049]">Focus and feedback</p>
                  <p className="mt-3 text-[15px] leading-[1.55] text-[#506380]">A 2 px blue outline with a 1 px offset marks keyboard focus on buttons, inputs, and the feedback text area. Selected feedback uses a pale blue fill and blue border.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-none bg-white p-6 md:p-8">
            <SectionHeading eyebrow="04 / Conversation" title="Message roles are distinct at a glance">
              Assistant content spans the conversation width on a soft gray surface. User messages align right on pale blue. Timestamp and response actions stay close to the message they describe.
            </SectionHeading>
            <div className="mt-8 rounded-none bg-[#EAF3FF] p-3 md:p-4">
              <div className="mx-auto max-w-3xl space-y-5 rounded-none bg-white p-5 md:p-6">
                <div>
                  <p className="mb-2 text-[14px] font-semibold text-[#052049]">Digital A11y <span className="ml-2 font-medium text-[#506380]">Accessibility and Compliance Support</span></p>
                  <div className="rounded-2xl bg-[#F2F3F4] px-4 py-3 text-[#101828]">
                    <p className="text-base leading-relaxed">I can help you find accessibility guidance and the right resources.</p>
                    <div className="mt-3 flex items-center gap-2 pt-1 text-[14px] font-medium text-[#506380]">
                      <span>10:42 AM</span>
                      <button type="button" aria-label="Helpful" className="ml-1 p-1.5 hover:bg-[#E7EAED]"><ThumbsUp className="h-3.5 w-3.5" /></button>
                      <button type="button" aria-label="Not helpful" className="p-1.5 hover:bg-[#E7EAED]"><ThumbsDown className="h-3.5 w-3.5" /></button>
                      <button type="button" aria-label="Copy assistant response" className="rounded-none p-1.5 text-[#506380] transition-colors hover:bg-[rgba(80,99,128,0.12)] hover:text-[#052049] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006BE9] focus-visible:ring-offset-2"><Copy className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl bg-[#EAF3FF] px-4 py-3 text-[#052049]">
                    <p className="text-base leading-relaxed">Where can I find the accessibility checklist?</p>
                    <div className="mt-3 flex items-center gap-2 text-[14px] font-medium text-[#506380]">
                      <span>10:43 AM</span>
                      <button type="button" aria-label="Copy user message" title="Copy" className="rounded-none p-1.5 text-[#506380] transition-colors hover:bg-[rgba(80,99,128,0.12)] hover:text-[#052049] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006BE9] focus-visible:ring-offset-2">
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-none bg-white p-6 md:p-8">
            <SectionHeading eyebrow="05 / Prompts and identity" title="Helpful entry points, consistent agent identity">
              Suggested prompts offer a clear starting point. Agent badges share a circular shape, with a white badge for the umbrella assistant and blue for specialized agents.
            </SectionHeading>
            <div className="mt-8 lg:grid lg:grid-cols-[minmax(0,1.45fr)_320px] lg:gap-6 xl:grid-cols-[minmax(0,1.55fr)_360px]">
              <div className="rounded-none bg-[#EAF3FF] p-3 md:p-4">
                <div className="rounded-none bg-white p-5 md:p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#506380]">Suggested prompts</p>
                    <div role="switch" aria-checked="true" aria-label="Suggested prompts shown" className="relative flex h-4 w-7 items-center rounded-full bg-[#006BE9]">
                      <span className="ml-3.5 h-2.5 w-2.5 rounded-full bg-white" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {[
                      "How do I get started?",
                      "Where can I find more information?",
                    ].map((prompt) => (
                      <button key={prompt} type="button" className="flex w-full items-start gap-3 bg-[#F2F3F4] px-3 py-2 text-left text-[#506380] hover:bg-[rgba(80,99,128,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006BE9]">
                        <MessageSquareMore className="mt-0.5 h-4 w-4 flex-none" />
                        <span>{prompt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-3 lg:mt-0">
                <div className="rounded-none bg-[#FBFDFF] p-4">
                  <p className="mb-4 text-[15px] font-semibold text-[#052049]">Agent badges</p>
                  <div className="flex flex-wrap gap-5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#006BE9]"><BrainCircuit className="h-6 w-6" /></span>
                      <span className="text-[15px] font-semibold text-[#052049]">Versa</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#006BE9] text-white"><MessageSquare className="h-6 w-6" /></span>
                      <span className="text-[15px] font-semibold text-[#052049]">Digital A11y</span>
                    </div>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-[#EAF3FF] px-3 py-1.5 text-sm font-medium text-[#052049]"><Check className="h-4 w-4" />Selected state</span>
                </div>
                <div className="rounded-none bg-[#FBFDFF] p-4">
                  <p className="mb-4 text-[15px] font-semibold text-[#052049]">Chat launcher</p>
                  <div className="flex justify-end">
                    <button type="button" className="inline-flex items-center gap-3 rounded-full bg-[#006BE9] px-5 py-4 font-semibold text-white shadow-xl">
                      <MessageSquare className="h-6 w-6" />
                      Ask a Question
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-none bg-white p-6 md:p-8">
            <SectionHeading eyebrow="06 / Iconography" title="A consistent set of interface icons">
              Chatbot icons use a clear line style with color and size matched to their role. These are the icons used across the chat interface.
            </SectionHeading>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {chatbotIcons.map(({ name, Icon, use }) => (
                <div key={name} className="flex min-h-24 items-center gap-4 bg-[#FBFDFF] p-4">
                  <span className="flex h-11 w-11 flex-none items-center justify-center bg-[#EAF3FF] text-[#506380]">
                    <Icon className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-[#052049]">{name}</p>
                    <p className="mt-1 text-[13px] leading-[1.4] text-[#506380]">{use}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
      <VersaChatWidget
        contextKey="landing"
        hasAccess={hasAccess}
        onAuthenticate={() => setHasAccess(true)}
        suggestedPrompts={activePage.prompts}
      />
    </main>
  );
}
