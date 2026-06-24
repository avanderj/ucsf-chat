"use client";

import React from "react";
import { X, Send, MessageSquare, MessageSquareMore, ThumbsUp, ThumbsDown, Maximize2, Minimize2, Copy, Check, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/Button";

interface VersaChatWidgetProps {
  contextKey?: string;
  hasAccess: boolean;
  onAuthenticate?: () => void;
  suggestedPrompts?: string[];
}

interface Message {
  agentId?: string;
  agentName?: string;
  id: string;
  text: string;
  sender: "user" | "versa";
  timestamp: Date;
  feedback?: "helpful" | "unhelpful";
}

interface AgentOption {
  id: string;
  name: string;
  description: string;
}

interface StoredWidgetState {
  activeAgentId?: string;
  messages?: Array<
    Omit<Message, "timestamp"> & {
      timestamp: string;
    }
  >;
}

export function VersaChatWidget({
  contextKey,
  hasAccess,
  onAuthenticate,
  suggestedPrompts,
}: VersaChatWidgetProps) {
  const widgetStateStorageKey = "ucsf-chat-widget-state";
  const agentOptions: AgentOption[] = [
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

  const launcherTooltip = (
    <div className="absolute bottom-full right-0 mb-3 w-max max-w-[90vw] border-2 border-[#006BE9] bg-[#f2f3f4] px-5 py-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-left">
      <p className="m-0 text-[18px] leading-[1.1] font-semibold text-[#052049]">
        AI Assistant
      </p>
      <p className="m-0 mt-1 text-base leading-[1.2] font-normal text-[#727272]">
        Ask, search, discover
      </p>
    </div>
  );

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAuthCardDismissed, setIsAuthCardDismissed] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const rawState = window.sessionStorage.getItem(widgetStateStorageKey);
      if (!rawState) {
        return [];
      }

      const parsedState = JSON.parse(rawState) as StoredWidgetState;

      return (parsedState.messages ?? []).map((message) => ({
        ...message,
        timestamp: new Date(message.timestamp),
      }));
    } catch {
      return [];
    }
  });
  const [inputValue, setInputValue] = useState("");
  const [hiddenSuggestionsKey, setHiddenSuggestionsKey] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const agentMenuRef = useRef<HTMLDivElement>(null);
  const nextMessageIdRef = useRef(2);
  const [activeAgentId, setActiveAgentId] = useState(() => {
    if (typeof window === "undefined") {
      return agentOptions[0].id;
    }

    try {
      const rawState = window.sessionStorage.getItem(widgetStateStorageKey);
      if (!rawState) {
        return agentOptions[0].id;
      }

      const parsedState = JSON.parse(rawState) as StoredWidgetState;
      const storedAgentId = parsedState.activeAgentId;

      return agentOptions.some((agent) => agent.id === storedAgentId)
        ? storedAgentId ?? agentOptions[0].id
        : agentOptions[0].id;
    } catch {
      return agentOptions[0].id;
    }
  });
  const [isAgentMenuOpen, setIsAgentMenuOpen] = useState(false);

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackMessageId, setFeedbackMessageId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const activeAgent =
    agentOptions.find((agent) => agent.id === activeAgentId) ?? agentOptions[0];
  const agentExperience: Record<
    string,
    {
      introBody: string;
      prompts: string[];
      title: string;
    }
  > = {
    "digital-a11y": {
      introBody:
        "Get help with accessibility requirements, document remediation, training resources, and practical guidance for digital content.",
      prompts:
        suggestedPrompts ?? [
          "How do I make a PDF accessible?",
          "What accessibility issues are highest risk for websites?",
          "Where can I find live help and training?",
          "Show me the main accessibility resources and FAQs.",
        ],
      title: "Accessibility and compliance support",
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
      title: "IT operating model guidance",
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
      title: "Identity and access modernization",
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
      title: "Program updates and implementation help",
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
      title: "Cloud operations and platform support",
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
      title: "Data governance and stewardship",
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
      title: "Support intake and request routing",
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
      title: "Digital workplace adoption support",
    },
  };
  const activeExperience =
    agentExperience[activeAgent.id] ?? agentExperience["digital-a11y"];
  const orderedAgentOptions = [
    activeAgent,
    ...agentOptions.filter((agent) => agent.id !== activeAgent.id),
  ];
  const promptSuggestions = activeExperience.prompts;
  const promptSuggestionsKey = `${contextKey ?? "default"}::${activeAgent.id}::${promptSuggestions.join("||")}`;
  const showSuggestions = hiddenSuggestionsKey !== promptSuggestionsKey;

  useEffect(() => {
    const numericMessageIds = messages
      .map((message) => Number(message.id))
      .filter((id) => Number.isFinite(id));
    const highestMessageId =
      numericMessageIds.length > 0 ? Math.max(...numericMessageIds) : 1;

    nextMessageIdRef.current = highestMessageId + 1;
  }, [messages]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const serializedState: StoredWidgetState = {
      activeAgentId,
      messages: messages.map((message) => ({
        ...message,
        timestamp: message.timestamp.toISOString(),
      })),
    };

    window.sessionStorage.setItem(
      widgetStateStorageKey,
      JSON.stringify(serializedState)
    );
  }, [activeAgentId, messages]);

  const handleFeedback = (messageId: string, type: "helpful" | "unhelpful") => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const isSameFeedback = msg.feedback === type;
          const newFeedback = isSameFeedback ? undefined : type;
          
          if (newFeedback === "unhelpful") {
            setFeedbackMessageId(messageId);
            setShowFeedbackModal(true);
          }
          
          return { ...msg, feedback: newFeedback };
        }
        return msg;
      })
    );
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (
        agentMenuRef.current &&
        !agentMenuRef.current.contains(event.target as Node)
      ) {
        setIsAgentMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  const handleSendMessage = (text?: string) => {
    const messageText = typeof text === "string" ? text : inputValue;
    if (!messageText.trim()) return;
    const isSuggestedPrompt = promptSuggestions.includes(messageText.trim());
    const sendingAgent = activeAgent;

    const userMessage: Message = {
      agentId: sendingAgent.id,
      agentName: sendingAgent.name,
      id: (nextMessageIdRef.current++).toString(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    if (isSuggestedPrompt) {
      setHiddenSuggestionsKey(promptSuggestionsKey);
    }

    // Simulate AI response
    simulateAIResponse(sendingAgent);
  };

  const simulateAIResponse = (agent: AgentOption) => {
    // Add a small delay for realism
    setTimeout(() => {
      const responses = [
        "I can help you with that. Let me search our application directory for you.",
        "Based on your request, I recommend checking out the following applications in the App Library.",
        "Great question! Here's what I found in UCSF resources...",
        "I understand you're looking for information about that. Would you like me to search across all UCSF resources?",
        "That's a common task. I can guide you through the process step by step.",
      ];

      const aiMessage: Message = {
        agentId: agent.id,
        agentName: agent.name,
        id: (nextMessageIdRef.current++).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: "versa",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    }, 800);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleNonAuthAuthenticate = () => {
    setIsAuthCardDismissed(true);
    setIsOpen(false);
    onAuthenticate?.();
  };

  const renderedMessages =
    messages.length === 0 ? (
      <div className="flex h-full min-h-[280px] flex-col items-center justify-center px-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F2F3F4]">
          <MessageSquare
            className="h-9 w-9 text-[#006BE9]"
            strokeWidth={2.2}
          />
        </div>
        <h3 className="mt-5 text-[30px] font-semibold leading-none text-[#052049]">
          {activeAgent.name}
        </h3>
        <p className="mt-4 text-[20px] font-semibold leading-tight text-[#052049]">
          {activeExperience.title}
        </p>
        <p className="mx-auto mt-3 max-w-[360px] text-[16px] leading-[1.5] text-[#506380]">
          {activeExperience.introBody}
        </p>
      </div>
    ) : (
      <>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col group/msg ${message.sender === "user"
                ? "items-end"
                : "items-start"
              }`}
          >
            <div
              className={`relative max-w-[85%] rounded-2xl px-4 py-3 ${message.sender === "user"
                  ? "bg-[#EAF3FF] text-[#052049]"
                  : "bg-white border-2 border-gray-200 text-gray-900"
                }`}
            >
              {message.sender === "versa" && (
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#052049]">
                    {message.agentName ?? activeAgent.name}
                  </span>
                </div>
              )}

              <p className="whitespace-pre-wrap text-base leading-relaxed">{message.text}</p>
            </div>

            <div className="mt-1.5 flex items-center gap-3 px-1">
              <p className="text-[14px] text-gray-400">
                {formatTime(message.timestamp)}
              </p>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleCopyMessage(message.id, message.text)}
                  className="rounded-md p-1 text-gray-400 transition-all hover:bg-blue-50 hover:text-[#006BE9]"
                  title="Copy message"
                >
                  {copiedId === message.id ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                      <Copy className="h-3.5 w-3.5" />
                  )}
                </button>

                {message.sender === "versa" && message.id !== "1" && (
                  <div className="ml-1 flex items-center gap-1 border-l border-gray-200 pl-1">
                    {(!message.feedback || message.feedback === "helpful") && (
                      <button
                        onClick={() => handleFeedback(message.id, "helpful")}
                        className={`rounded-md p-1 transition-all hover:bg-gray-100 ${
                          message.feedback === "helpful" ? "bg-blue-50 text-[#006BE9]" : "text-gray-400"
                        }`}
                        title={message.feedback === "helpful" ? "Undo helpful selection" : "Helpful"}
                      >
                        <ThumbsUp className={`h-3.5 w-3.5 ${message.feedback === "helpful" ? "fill-current" : ""}`} />
                      </button>
                    )}
                    {(!message.feedback || message.feedback === "unhelpful") && (
                      <button
                        onClick={() => handleFeedback(message.id, "unhelpful")}
                        className={`rounded-md p-1 transition-all hover:bg-gray-100 ${
                          message.feedback === "unhelpful" ? "bg-red-50 text-red-500" : "text-gray-400"
                        }`}
                        title={message.feedback === "unhelpful" ? "Undo unhelpful selection" : "Not helpful"}
                      >
                        <ThumbsDown className={`h-3.5 w-3.5 ${message.feedback === "unhelpful" ? "fill-current" : ""}`} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </>
    );

  // No Access View - Login CTA
  if (!hasAccess) {
    return (
      <>
        {!isAuthCardDismissed && (
          <div className="fixed bottom-5 right-5 z-40 w-[min(448px,calc(100vw-2rem))] overflow-hidden bg-white shadow-[0_20px_45px_rgba(5,32,73,0.12)] text-[#171717] scheme-light">
            <div className="relative bg-[#006BE9] px-[30px] pb-[24px] pt-[22px] text-white">
              <button
                onClick={() => setIsAuthCardDismissed(true)}
                className="absolute right-[22px] top-[18px] rounded-md p-1 text-white/90 transition-colors hover:text-white"
                aria-label="Dismiss AI Assistant card"
              >
                <X className="h-[28px] w-[28px]" strokeWidth={2} />
              </button>

              <div className="flex flex-col items-center justify-center gap-3 pt-2 text-center">
                <div className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-white">
                  <MessageSquare
                    className="h-[35px] w-[38px] flex-shrink-0 text-[#006BE9]"
                    strokeWidth={2.25}
                  />
                </div>
              </div>
            </div>

            <div className="px-[30px] py-[30px] text-center">
              <div className="text-[#052049]">
                <h3 className="text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] text-[#052049]">
                  Ask Digital A11y
                </h3>
              </div>

              <p className="mx-auto mt-[30px] max-w-[388px] text-[16px] font-normal leading-[1.32] tracking-[-0.02em] text-[#667085]">
                Get answers about PDFs, alt text, and other digital accessibility requirements.
              </p>

              <div className="mt-[34px]">
                <Button
                  variant="primary"
                  onClick={handleNonAuthAuthenticate}
                  className="!h-auto !w-full !rounded-full !border-2 !py-[11px] !text-[16px] !font-semibold !leading-none"
                  aria-label="Log In via MyAccess"
                >
                  Log In via MyAccess
                </Button>
              </div>
            </div>
          </div>
        )}

        {isAuthCardDismissed && (
          <button
            onClick={() => setIsAuthCardDismissed(false)}
            className="group fixed bottom-6 right-6 z-40 flex items-center justify-center rounded-full bg-[#006BE9] p-3.5 shadow-lg transition-transform hover:scale-105"
            style={{ width: '88px', height: '88px' }}
            aria-label="Open Digital A11y Assistant login card"
          >
            <MessageSquare className="h-[46px] w-[46px] text-white" strokeWidth={2} />
            {launcherTooltip}
          </button>
        )}
      </>
    );
  }

  const showBlueMinimizedTrigger = hasAccess;

  // Has Access View - Chat Interface
  return (
    <>
      {/* Chat Widget */}
      {isOpen && (
        <div
          className={`fixed bottom-0 right-0 md:bottom-8 md:right-8 bg-white transition-all duration-300 z-50 flex flex-col shadow-2xl text-[#171717] scheme-light rounded-t-xl md:rounded-t-2xl ${
            isExpanded 
              ? "w-full md:w-[850px] h-full md:h-[85vh]" 
              : "w-full md:w-[490px] h-full md:h-[800px] md:max-h-[85vh]"
          }`}
        >
          {/* Header */}
          <div className="bg-[#052049] text-white px-5 py-5 flex items-center justify-between flex-shrink-0">
            <div className="relative mr-auto" ref={agentMenuRef}>
              <button
                type="button"
                className={`flex w-full min-w-0 items-center gap-3 rounded-none px-3 py-2 text-left transition-colors focus-visible:outline-none ${
                  isAgentMenuOpen
                    ? "bg-white/10"
                    : "hover:bg-white/10 focus-visible:bg-white/10"
                }`}
                aria-haspopup="listbox"
                aria-expanded={isAgentMenuOpen}
                onClick={() => setIsAgentMenuOpen((prev) => !prev)}
              >
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center">
                  <MessageSquare className="h-8 w-8 text-[#006BE9]" strokeWidth={2.25} />
                </div>
                <div className="flex min-w-0 items-center gap-1.5">
                  <h3 className="truncate font-bold text-[18px] tracking-tight leading-[1.15]">
                    {activeAgent.name}
                  </h3>
                  <ChevronDown
                    className={`mt-0.5 h-4 w-4 flex-shrink-0 text-white/80 transition-transform duration-200 ${
                      isAgentMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              <div
                className={`absolute left-0 top-full z-20 mt-2 w-[360px] rounded-none bg-white px-4 pb-4 pt-2 shadow-[0_20px_45px_rgba(5,32,73,0.2)] transition-all duration-200 ${
                  isAgentMenuOpen
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-1 opacity-0"
                }`}
              >
                <p className="mb-2 flex h-10 items-center pb-0 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#506380]">
                  Select another IT agent
                </p>
                <div
                  role="listbox"
                  aria-label="Available agents"
                  className="max-h-[286px] space-y-1 overflow-y-auto"
                >
                  {orderedAgentOptions.map((agent) => (
                      <button
                        key={agent.id}
                        type="button"
                        onClick={() => {
                          setActiveAgentId(agent.id);
                          setIsAgentMenuOpen(false);
                        }}
                        className={`flex w-full flex-col rounded-none px-3 py-2 text-left transition-colors hover:bg-[#F2F3F4] focus-visible:bg-[#F2F3F4] focus-visible:outline-none ${
                          agent.id === activeAgent.id
                            ? "bg-[#EAF3FF]"
                            : ""
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2.5">
                            <MessageSquare
                              className="h-4 w-4 flex-shrink-0 text-[#006BE9]"
                              strokeWidth={2.2}
                            />
                            <span className="text-[15px] font-semibold leading-tight text-[#052049]">
                              {agent.name}
                            </span>
                          </div>
                          {agent.id === activeAgent.id ? (
                            <Check
                              className="h-4 w-4 flex-shrink-0 self-center text-[#052049]"
                              strokeWidth={3}
                            />
                          ) : null}
                        </div>
                        <span className="mt-1 pl-[26px] text-[13px] leading-[1.35] text-[#506380]">
                          {agent.description}
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden md:block p-1.5 rounded-lg transition-colors hover:bg-white/10"
                aria-label={isExpanded ? "Minimize chat" : "Expand chat"}
                title={isExpanded ? "Shrink" : "Expand to fill side"}
              >
                {isExpanded ? (
                  <Minimize2 className="w-5 h-5" />
                ) : (
                  <Maximize2 className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsExpanded(false);
                  setIsAgentMenuOpen(false);
                }}
                className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
                {renderedMessages}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t-2 border-gray-100 bg-[#F2F3F4] p-4 flex-shrink-0">
                <div className="flex items-stretch">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a question..."
                    className="h-16 flex-1 border-0 border-l-4 border-l-[#8B919A] bg-white px-4 text-base text-[#052049] placeholder:text-[#052049] focus:outline-none"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim()}
                    className="flex h-16 w-16 items-center justify-center bg-[#3C69D9] text-white rounded-none hover:bg-[#2F58BE] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    aria-label="Send message"
                  >
                    <Send className="h-6 w-6" strokeWidth={2.2} />
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#506380]">
                      Suggested prompts
                    </span>
                    <button
                      onClick={() =>
                        setHiddenSuggestionsKey((prev) =>
                          prev === promptSuggestionsKey ? null : promptSuggestionsKey
                        )
                      }
                      role="switch"
                      aria-checked={showSuggestions}
                      className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none ${
                        showSuggestions ? "bg-[#006BE9]" : "bg-gray-200"
                      }`}
                      aria-label="Toggle suggested prompts"
                    >
                      <span
                        className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${
                          showSuggestions ? "translate-x-3.5" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      showSuggestions ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="space-y-2 pb-1">
                      {promptSuggestions.map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => handleSendMessage(prompt)}
                          className="flex w-full items-start gap-3 bg-[#F2F3F4] px-3 py-2 text-left text-base text-[#506380] transition-colors hover:bg-[#E7EAED]"
                        >
                          <MessageSquareMore
                            className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#506380]"
                            strokeWidth={2.1}
                          />
                          <span>{prompt}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-400 mt-4 text-center leading-tight">
                  AI responses may vary. Always verify critical information.
                </p>
              </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 text-[#171717] scheme-light">
          <div className="bg-white rounded-none w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-[#D1D3D3] shadow-2xl">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[#052049] font-bold text-xl">Help us improve</h3>
                <button 
                  onClick={() => setShowFeedbackModal(false)}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <p className="text-[#506380] mb-6 text-[16px] leading-[1.5]">
                We&apos;re sorry this response wasn&apos;t helpful. Please tell us more about what was missing or incorrect.
              </p>
              
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full min-h-[140px] p-4 bg-gray-50 border-2 border-gray-100 rounded-none text-[16px] focus:outline-none focus:ring-2 focus:ring-[#006BE9]/20 focus:border-[#006BE9] transition-all resize-none mb-8"
                autoFocus
              />
              
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <Button
                  variant="primary"
                  onClick={() => {
                    console.log(`Feedback for ${feedbackMessageId}: ${feedbackText}`);
                    setShowFeedbackModal(false);
                    setFeedbackText("");
                  }}
                  className="!rounded-none"
                >
                  Submit Feedback
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsAgentMenuOpen(false);
            setIsOpen(true);
          }}
          style={showBlueMinimizedTrigger ? undefined : { width: '88px', height: '88px' }}
          className={`group fixed bottom-6 right-6 transition-all duration-300 flex items-center justify-center z-40 shadow-xl ${
            showBlueMinimizedTrigger
              ? "rounded-full bg-[#006BE9] px-5 py-4 gap-3 text-white hover:scale-105"
              : "rounded-full bg-white border-2 border-gray-200 hover:scale-110 animate-pulse-twice"
          }`}
          aria-label="Open AI Assistant"
        >
          {showBlueMinimizedTrigger ? (
            <>
              <MessageSquare className="h-8 w-8 flex-shrink-0 text-white" strokeWidth={2.1} />
              <span className="whitespace-nowrap text-[18px] font-semibold leading-none text-white">
                Ask a question
              </span>
            </>
          ) : (
            <MessageSquare className="h-8 w-8 text-[#006BE9]" strokeWidth={2.1} />
          )}
          {!showBlueMinimizedTrigger && launcherTooltip}
        </button>
      )}
    </>
  );
}
