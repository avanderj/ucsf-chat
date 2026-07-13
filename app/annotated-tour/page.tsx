import Image from "next/image";
import Link from "next/link";

type ScreenshotCallout = {
  body: string;
  label: string;
  number: string;
  targetX: number;
  targetY: number;
};

function AnnotatedScreenshot({
  body,
  callouts,
  eyebrow,
  src,
  title,
}: {
  body: string;
  callouts: ScreenshotCallout[];
  eyebrow: string;
  src: string;
  title: string;
}) {
  return (
    <section className="rounded-none bg-white p-6 md:p-8">
      <div className="max-w-3xl">
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#006BE9]">
          {eyebrow}
        </p>
        <h3 className="mt-3 text-[30px] font-semibold tracking-[-0.03em] text-[#052049]">
          {title}
        </h3>
        <p className="mt-4 text-[17px] leading-[1.6] text-[#506380]">{body}</p>
      </div>

      <div className="mt-8 lg:grid lg:grid-cols-[minmax(0,1.45fr)_320px] lg:gap-6 xl:grid-cols-[minmax(0,1.55fr)_360px]">
        <div className="rounded-none bg-[#EAF3FF] p-3 md:p-4">
          <div className="relative overflow-hidden rounded-none bg-white">
            <Image
              src={src}
              alt={title}
              width={1280}
              height={720}
              className="h-auto w-full"
              priority={false}
            />

            <div className="absolute inset-0 hidden lg:block">
              {callouts.map((callout) => (
                <div
                  key={callout.number}
                  className="absolute"
                  style={{
                    left: `${callout.targetX}%`,
                    top: `${callout.targetY}%`,
                  }}
                >
                  <div className="absolute -translate-x-1/2 -translate-y-1/2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#FEB80A] text-[14px] font-semibold text-[#052049] shadow-[0_10px_24px_rgba(254,184,10,0.35)]">
                      {callout.number}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3 lg:mt-0">
          {callouts.map((callout) => (
            <div
              key={`${callout.number}-detail`}
              className="rounded-none bg-[#FBFDFF] p-4"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[#FEB80A] text-[13px] font-semibold text-[#052049]">
                  {callout.number}
                </div>
                <p className="text-[15px] font-semibold text-[#052049]">
                  {callout.label}
                </p>
              </div>
              <p className="mt-3 text-[15px] leading-[1.55] text-[#506380]">
                {callout.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const screenshotSections = [
  {
    body: "",
    callouts: [
      {
        body:
          "Keep the language centered on the value users get right away: clear answers, practical guidance, and relevant resources in one place.",
        label: "Focus on the what/why",
        number: "1",
        targetX: 58,
        targetY: 75,
      },
    ],
    eyebrow: "Screenshot 01",
    src: "/annotated-tour/landing-guest-card.png",
    title: "Logging in",
  },
  {
    body:
      "Once authenticated, the chat opens immediately and the default agent is set to a specific agent that fits the context of the page. Digital A11y is the use case here. The screenshot below shows the empty-state with the agent name and description, input area, and suggested prompts.",
    callouts: [
      {
        body:
          "The active agent name sits in the header so users always know which agent they are conversing with.",
        label: "Agent-specific shell",
        number: "1",
        targetX: 20,
        targetY: 6,
      },
      {
        body:
          "The empty-state title and supporting description explain what this agent can help with.",
        label: "Agent title and description",
        number: "2",
        targetX: 15,
        targetY: 28,
      },
      {
        body:
          "Suggested prompts change with the current page context so the agent can offer starting points that fit what the user is looking at. They stay visible while the user is typing and collapse only after the user submits a question.",
        label: "Page-specific prompts",
        number: "3",
        targetX: 68,
        targetY: 73,
      },
    ],
    eyebrow: "Screenshot 02",
    src: "/annotated-tour/landing-authenticated-chat-focused.png",
    title: "After authenticating",
  },
  {
    body:
      "This view keeps scope, feedback, and state cues together so people can understand the response and react without losing their place.",
    callouts: [
      {
        body:
          "Showing Accessibility and Compliance Support beside the agent name makes the scope of help visible before the user even reads the answer.",
        label: "Scope stays visible",
        number: "1",
        targetX: 56,
        targetY: 39,
      },
    ],
    eyebrow: "Screenshot 03",
    src: "/annotated-tour/response-feedback-live.png",
    title: "Response actions in context",
  },
  {
    body:
      "The agent switcher is part of the live chat widget, not a separate diagram. This screenshot captures the umbrella IT Chat option and the current agent.",
    callouts: [
      {
        body:
          "Selecting the dropdown caret will display other agent options.",
        label: "Dropdown opens agent options",
        number: "1",
        targetX: 69,
        targetY: 14,
      },
      {
        body:
          "The umbrella IT Chat option is always listed at the top.",
        label: "IT Chat stays at the top",
        number: "2",
        targetX: 58,
        targetY: 32,
      },
      {
        body:
          "The current agent is always listed at the top of the agents.",
        label: "Current agent stays first",
        number: "3",
        targetX: 58,
        targetY: 51,
      },
      {
        body:
          "Other available agents remain underneath the current agent in the same menu.",
        label: "Other agents follow below",
        number: "4",
        targetX: 58,
        targetY: 71,
      },
    ],
    eyebrow: "Screenshot 04",
    src: "/annotated-tour/agent-menu-open.png",
    title: "Agent switching happens inside the open chat",
  },
];

export default function StyleGuidePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#EEF5FF_0%,#F8FBFF_18%,#FFFFFF_60%)] text-[#171717]">
      <section className="border-b border-[#D8E3F2] bg-[#052049] px-6 py-16 text-white md:px-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#7EC2FF]">
            Versa Chat System
          </p>
          <h1 className="mt-4 max-w-4xl text-[44px] font-semibold leading-[0.95] tracking-[-0.04em] md:text-[64px]">
            Annotated Tour
          </h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full border-2 border-[#006BE9] bg-[#006BE9] px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:border-[#0F388A] hover:bg-[#0F388A]"
            >
              Return to Demo
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-12 md:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="space-y-8">
            {screenshotSections.map((section) => (
              <AnnotatedScreenshot
                key={section.title}
                body={section.body}
                callouts={section.callouts}
                eyebrow={section.eyebrow}
                src={section.src}
                title={section.title}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
