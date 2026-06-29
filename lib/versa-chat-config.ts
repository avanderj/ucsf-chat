export type PageKey = "landing" | "office-accessibility";

export interface AgentOption {
  id: string;
  name: string;
  description: string;
}

export interface AgentExperience {
  introBody: string;
  prompts: string[];
  title: string;
}

export interface DemoPageContent {
  alt: string;
  height: number;
  prompts: string[];
  src: string;
  width: number;
}

export const widgetStateStorageKey = "ucsf-chat-widget-state";

export const umbrellaAgent: AgentOption = {
  id: "it-chat",
  name: "IT Chat",
  description: "Broader IT support and guidance across services, tools, and teams",
};

export const scopedAgentOptions: AgentOption[] = [
  {
    id: "digital-a11y",
    name: "Digital A11y",
    description: "Accessibility and compliance support",
  },
  {
    id: "itom",
    name: "IT Operating Model (ITOM)",
    description: "Operating model guidance, service design, and team workflows",
  },
  {
    id: "iam-modernization",
    name: "IAM Modernization Guide",
    description: "Identity, access, and modernization program support",
  },
  {
    id: "project-one",
    name: "Project One Navigator",
    description: "Program updates, milestones, and implementation help",
  },
  {
    id: "cloud-ops",
    name: "Cloud Operations Advisor",
    description: "Platform operations, environments, and support pathways",
  },
  {
    id: "data-governance",
    name: "Data Governance Helper",
    description: "Data stewardship, standards, and governance questions",
  },
  {
    id: "service-desk",
    name: "Service Desk Assistant",
    description: "Incident routing, support intake, and request guidance",
  },
  {
    id: "digital-workplace",
    name: "Digital Workplace Coach",
    description: "Collaboration tools, rollout support, and adoption help",
  },
];

export const agentOptions = [umbrellaAgent, ...scopedAgentOptions];
export const defaultAgentId = scopedAgentOptions[0].id;

export const defaultDigitalA11yPrompts = [
  "How do I make a PDF accessible?",
  "What accessibility issues are highest risk for websites?",
  "Where can I find live help and training?",
  "Show me the main accessibility resources and FAQs.",
];

export const demoPageContent: Record<PageKey, DemoPageContent> = {
  landing: {
    alt: "DCAP landing page",
    height: 4583,
    prompts: defaultDigitalA11yPrompts,
    src: "/DCAP-landing.png",
    width: 5118,
  },
  "office-accessibility": {
    alt: "Word, PowerPoint, and Excel accessibility page",
    height: 9498,
    prompts: [
      "How do I create an accessible Word document?",
      "What are the PowerPoint-specific accessibility tips?",
      "What should I check for Excel accessibility?",
      "Where can I find accessibility checkers and templates?",
    ],
    src: "/word-powerpoint-excel-accessibility.png",
    width: 5120,
  },
};

export const agentExperienceMap: Record<string, AgentExperience> = {
  "it-chat": {
    introBody:
      "Start here for broader IT questions, service navigation, support pathways, and help finding the right team or resource.",
    prompts: [
      "Who should I contact for this IT issue?",
      "How do I route a general IT request?",
      "What team owns this service or platform?",
      "Where should I start if I am not sure which IT area applies?",
    ],
    title: "Broader IT Support and Guidance",
  },
  "digital-a11y": {
    introBody:
      "Get help with accessibility requirements, document remediation, training resources, and practical guidance for digital content.",
    prompts: defaultDigitalA11yPrompts,
    title: "Accessibility and Compliance Support",
  },
  itom: {
    introBody:
      "Ask about service design, team roles, operating model decisions, workflows, and support handoffs.",
    prompts: [
      "How should we define service ownership?",
      "What workflows should this team standardize?",
      "How should support and escalation be structured?",
      "What operating model gaps should we assess first?",
    ],
    title: "IT Operating Model Guidance",
  },
  "iam-modernization": {
    introBody:
      "Get help with identity strategy, access design, modernization planning, and rollout priorities.",
    prompts: [
      "What should an IAM modernization roadmap include?",
      "How should roles and entitlements be structured?",
      "What identity risks should we prioritize first?",
      "How should we phase IAM modernization work?",
    ],
    title: "Identity and Access Modernization",
  },
  "project-one": {
    introBody:
      "Ask for implementation guidance, milestone awareness, team readiness, and workstream coordination support.",
    prompts: [
      "What are the key Project One milestones?",
      "What should teams prepare for next?",
      "How does this workstream affect implementation?",
      "What dependencies should we be tracking?",
    ],
    title: "Program Updates and Implementation Help",
  },
  "cloud-ops": {
    introBody:
      "Get support with environments, operational pathways, platform questions, and cloud service coordination.",
    prompts: [
      "How do I route a cloud operations request?",
      "What environment issue should we check first?",
      "How should operational support handoffs work?",
      "What cloud operations details should teams document?",
    ],
    title: "Cloud Operations and Platform Support",
  },
  "data-governance": {
    introBody:
      "Ask about stewardship, standards, data ownership, governance decisions, and policy alignment.",
    prompts: [
      "What data governance standards apply here?",
      "Who should own this data decision?",
      "How do we define stewardship for this dataset?",
      "What governance questions should we answer first?",
    ],
    title: "Data Governance and Stewardship",
  },
  "service-desk": {
    introBody:
      "Get help with intake, routing, escalation, incident categorization, and request handling.",
    prompts: [
      "How should this request be routed?",
      "Is this an incident, request, or problem?",
      "What should go into the intake ticket?",
      "When should this issue be escalated?",
    ],
    title: "Support Intake and Request Routing",
  },
  "digital-workplace": {
    introBody:
      "Ask about rollout planning, training, adoption support, communications, and collaboration tool enablement.",
    prompts: [
      "How do we support adoption for this tool?",
      "What rollout communications should we prepare?",
      "How should we train teams on this change?",
      "What support materials should we create?",
    ],
    title: "Digital Workplace Adoption Support",
  },
};

export function getAgentExperience(
  agentId: string,
  suggestedPrompts?: string[]
): AgentExperience {
  const baseExperience =
    agentExperienceMap[agentId] ?? agentExperienceMap[umbrellaAgent.id];

  if (agentId !== "digital-a11y" || !suggestedPrompts) {
    return baseExperience;
  }

  return {
    ...baseExperience,
    prompts: suggestedPrompts,
  };
}

export const guestBodyCopyByContext: Record<PageKey, string> = {
  landing:
    "Get answers about PDFs, alt text, and other digital accessibility requirements.",
  "office-accessibility":
    "Get help with accessible Word documents, PowerPoint presentations, Excel workbooks, and built-in accessibility tools.",
};

export const assistantVisualTokens = {
  badgeBehavior: {
    emptyState: "16x16 badge, blue fill for scoped agents, white fill for IT Chat",
    header: "10x10 badge in the selector trigger and expanded header",
    menu: "10x10 badge in agent menu rows",
  },
  colors: {
    accentBlue: "#006BE9",
    backgroundBlue: "#052049",
    lightBlueSurface: "#EAF3FF",
    mutedGray: "#506380",
    panelBackground: "#F2F3F4",
    white: "#FFFFFF",
  },
  typography: {
    cardTitle: "40px / 1.05 / semibold",
    dropdownSectionLabel: "13px uppercase / tracking 0.08em / semibold",
    emptyStateAgentName: "30px / semibold",
    emptyStateTitle: "20px / semibold",
    launcherLabel: "18px / semibold",
  },
};

export const assistantBusinessRules = [
  {
    title: "Contextual default agent",
    description:
      "The current page determines the starting context. On the accessibility demo pages, Digital A11y is the default scoped experience.",
  },
  {
    title: "Umbrella IT Chat option",
    description:
      "The dropdown always presents IT Chat first as the broader entry point, followed by a separate Switch to Another Agent section for scoped experiences.",
  },
  {
    title: "Per-agent conversation memory",
    description:
      "Chat history is stored by agent. Switching pages keeps the current agent transcript in place, and switching agents shows that agent's own conversation state.",
  },
  {
    title: "Scoped return behavior",
    description:
      "If a user returns to an agent they already used, that agent's prior transcript is restored.",
  },
  {
    title: "Cross-agent reset behavior",
    description:
      "If a user switches to an agent with no prior history, the widget shows that agent's empty-state title, intro copy, and prompts.",
  },
  {
    title: "Authentication reset behavior",
    description:
      "Logging out clears persisted widget state. Logging back in opens the chat immediately in a fresh authenticated state.",
  },
  {
    title: "Page-specific guest copy",
    description:
      "The logged-out card body copy changes with the current page context, while the authenticated shell and interaction model stay consistent.",
  },
  {
    title: "Prompt visibility control",
    description:
      "Suggested prompts can be toggled within the current view, and they reopen when the user switches back to an agent or page context.",
  },
];

export const assistantSpecificityRules = {
  pageSpecific: [
    "Default suggested prompts for Digital A11y can change by page.",
    "Logged-out body copy can change by page.",
    "Page imagery and click-through hotspots are page-specific demo content.",
  ],
  sharedAcrossPages: [
    "Authentication flow and login card behavior.",
    "Dropdown structure, including IT Chat as umbrella plus scoped agent list.",
    "Badge/icon treatment for IT Chat versus scoped agents.",
    "Feedback, copy, expand/minimize, and prompt-toggle interaction patterns.",
    "Per-agent transcript storage and restoration within an authenticated session.",
  ],
};
