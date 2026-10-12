"use client";

import React from "react";
import { X, Send, MessageSquare, MessageSquareMore, ThumbsUp, ThumbsDown, Maximize2, Minimize2, Copy, Check, ChevronDown, BrainCircuit } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/Button";
import {
  agentOptions,
  defaultAgentId,
  guestBodyCopy,
  getAgentExperience,
  scopedAgentOptions,
  umbrellaAgent,
  widgetStateStorageKey,
  type AgentOption,
} from "@/lib/versa-chat-config";

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

interface StoredWidgetState {
  activeAgentId?: string;
  conversations?: Record<
    string,
    Array<
      Omit<Message, "timestamp"> & {
        timestamp: string;
      }
    >
  >;
  messages?: Array<
    Omit<Message, "timestamp"> & {
      timestamp: string;
    }
  >;
}

const EMPTY_MESSAGES: Message[] = [];

const getConversationStorageKey = (agentId: string) => agentId;

const normalizeStoredConversations = (
  conversations?: StoredWidgetState["conversations"]
): Record<string, Message[]> => {
  if (!conversations) {
    return {};
  }

  const mergedConversations = new Map<string, Message[]>();

  Object.entries(conversations).forEach(([storedKey, storedMessages]) => {
    const keyParts = storedKey.split("::");
    const normalizedAgentId = keyParts[keyParts.length - 1] || storedKey;
    const nextMessages = storedMessages.map((message) => ({
      ...message,
      timestamp: new Date(message.timestamp),
    }));
    const existingMessages = mergedConversations.get(normalizedAgentId) ?? [];

    mergedConversations.set(
      normalizedAgentId,
      [...existingMessages, ...nextMessages].sort(
        (left, right) => left.timestamp.getTime() - right.timestamp.getTime()
      )
    );
  });

  return Object.fromEntries(mergedConversations);
};

export function VersaChatWidget({
  contextKey,
  hasAccess,
  onAuthenticate,
  suggestedPrompts,
}: VersaChatWidgetProps) {
  const normalizedContextKey = contextKey ?? "default";

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

  const [isOpen, setIsOpen] = useState(hasAccess);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAuthCardDismissed, setIsAuthCardDismissed] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<
    Record<string, Message[]>
  >(() => {
    if (typeof window === "undefined" || !hasAccess) {
      return {};
    }

    try {
      const rawState = window.sessionStorage.getItem(widgetStateStorageKey);
      if (!rawState) {
        return {};
      }

      const parsedState = JSON.parse(rawState) as StoredWidgetState;
      const conversations = parsedState.conversations;

      if (conversations) {
        return normalizeStoredConversations(conversations);
      }

      if (parsedState.messages?.length) {
        return {
          [getConversationStorageKey(parsedState.activeAgentId ?? defaultAgentId)]:
            parsedState.messages.map((message) => ({
              ...message,
              timestamp: new Date(message.timestamp),
            })),
        };
      }

      return {};
    } catch {
      return {};
    }
  });
  const [inputValue, setInputValue] = useState("");
  const [hiddenSuggestionsKey, setHiddenSuggestionsKey] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const agentMenuRef = useRef<HTMLDivElement>(null);
  const nextMessageIdRef = useRef(2);
  const responseTimeoutsRef = useRef<number[]>([]);
  const [activeAgentId, setActiveAgentId] = useState(() => {
    if (typeof window === "undefined" || !hasAccess) {
      return defaultAgentId;
    }

    try {
      const rawState = window.sessionStorage.getItem(widgetStateStorageKey);
      if (!rawState) {
        return defaultAgentId;
      }

      const parsedState = JSON.parse(rawState) as StoredWidgetState;
      const storedAgentId = parsedState.activeAgentId;

      return agentOptions.some((agent) => agent.id === storedAgentId)
        ? storedAgentId ?? defaultAgentId
        : defaultAgentId;
    } catch {
      return defaultAgentId;
    }
  });
  const [isAgentMenuOpen, setIsAgentMenuOpen] = useState(false);

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackMessageId, setFeedbackMessageId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const activeAgent =
    agentOptions.find((agent) => agent.id === activeAgentId) ?? agentOptions[0];
  const activeConversationKey = getConversationStorageKey(activeAgentId);
  const messages = conversationHistory[activeConversationKey] ?? EMPTY_MESSAGES;
  const renderAgentBadge = (
    agent: AgentOption,
    size: "menu" | "header" | "empty" = "menu"
  ) => {
    const isUmbrellaAgent = agent.id === umbrellaAgent.id;
    const badgeBaseClassName =
      "inline-flex aspect-square flex-none shrink-0 items-center justify-center overflow-hidden rounded-full";
    const containerClassName =
      size === "empty"
        ? isUmbrellaAgent
          ? `${badgeBaseClassName} h-[clamp(3.25rem,6vw,4rem)] w-[clamp(3.25rem,6vw,4rem)] bg-white`
          : `${badgeBaseClassName} h-[clamp(3.25rem,6vw,4rem)] w-[clamp(3.25rem,6vw,4rem)] bg-[#006BE9]`
        : size === "header"
          ? isUmbrellaAgent
            ? `${badgeBaseClassName} h-[clamp(2.5rem,4vw,2.75rem)] w-[clamp(2.5rem,4vw,2.75rem)] bg-white`
            : `${badgeBaseClassName} h-[clamp(2.5rem,4vw,2.75rem)] w-[clamp(2.5rem,4vw,2.75rem)] bg-[#006BE9]`
          : isUmbrellaAgent
            ? `${badgeBaseClassName} h-[clamp(2.5rem,4vw,2.75rem)] w-[clamp(2.5rem,4vw,2.75rem)] bg-white`
            : `${badgeBaseClassName} h-[clamp(2.5rem,4vw,2.75rem)] w-[clamp(2.5rem,4vw,2.75rem)] bg-[#006BE9]`;
    const iconClassName =
      size === "empty"
        ? isUmbrellaAgent
          ? "h-[clamp(1.6rem,3vw,2rem)] w-[clamp(1.6rem,3vw,2rem)] text-[#006BE9]"
          : "h-[clamp(1.6rem,3vw,2rem)] w-[clamp(1.6rem,3vw,2rem)] text-white"
        : size === "header"
          ? isUmbrellaAgent
            ? "h-[clamp(1.1rem,1.8vw,1.35rem)] w-[clamp(1.1rem,1.8vw,1.35rem)] text-[#006BE9]"
            : "h-[clamp(1.1rem,1.8vw,1.35rem)] w-[clamp(1.1rem,1.8vw,1.35rem)] text-white"
          : isUmbrellaAgent
            ? "h-[clamp(1.1rem,1.8vw,1.35rem)] w-[clamp(1.1rem,1.8vw,1.35rem)] text-[#006BE9]"
            : "h-[clamp(1.1rem,1.8vw,1.35rem)] w-[clamp(1.1rem,1.8vw,1.35rem)] text-white";

    return (
      <div className={containerClassName}>
        {isUmbrellaAgent ? (
          <BrainCircuit className={iconClassName} strokeWidth={2.1} />
        ) : (
          <MessageSquare className={iconClassName} strokeWidth={2.1} />
        )}
      </div>
    );
  };
  const activeExperience = getAgentExperience(activeAgent.id, suggestedPrompts);
  const orderedScopedAgentOptions = [
    ...scopedAgentOptions.filter((agent) => agent.id === activeAgent.id),
    ...scopedAgentOptions.filter((agent) => agent.id !== activeAgent.id),
  ];
  const promptSuggestions = activeExperience.prompts;
  const promptSuggestionsKey = `${normalizedContextKey}::${activeAgent.id}::${promptSuggestions.join("||")}`;
  const showSuggestions = hiddenSuggestionsKey !== promptSuggestionsKey;
  const clearPendingResponses = () => {
    responseTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    responseTimeoutsRef.current = [];
  };

  const updateConversationMessages = (
    conversationKey: string,
    updater: (messages: Message[]) => Message[]
  ) => {
    setConversationHistory((prev) => ({
      ...prev,
      [conversationKey]: updater(prev[conversationKey] ?? []),
    }));
  };

  useEffect(() => {
    const numericMessageIds = Object.values(conversationHistory)
      .flat()
      .map((message) => Number(message.id))
      .filter((id) => Number.isFinite(id));
    const highestMessageId =
      numericMessageIds.length > 0 ? Math.max(...numericMessageIds) : 1;

    nextMessageIdRef.current = highestMessageId + 1;
  }, [conversationHistory]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!hasAccess) {
      window.sessionStorage.removeItem(widgetStateStorageKey);
      return;
    }

    const serializedState: StoredWidgetState = {
      activeAgentId,
      conversations: Object.fromEntries(
        Object.entries(conversationHistory).map(([key, conversationMessages]) => [
          key,
          conversationMessages.map((message) => ({
            ...message,
            timestamp: message.timestamp.toISOString(),
          })),
        ])
      ),
    };

    window.sessionStorage.setItem(
      widgetStateStorageKey,
      JSON.stringify(serializedState)
    );
  }, [activeAgentId, conversationHistory, hasAccess]);

  useEffect(() => {
    return () => {
      clearPendingResponses();
    };
  }, []);

  const handleAgentSelect = (agentId: string) => {
    setHiddenSuggestionsKey(null);
    setActiveAgentId(agentId);
    setIsAgentMenuOpen(false);
  };

  const handleFeedback = (messageId: string, type: "helpful" | "unhelpful") => {
    updateConversationMessages(activeConversationKey, (prev) =>
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
    if (!isOpen) {
      return;
    }

    const animationFrameId = window.requestAnimationFrame(() => {
      scrollToBottom();
    });
    const timeoutId = window.setTimeout(() => {
      scrollToBottom();
    }, 220);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.clearTimeout(timeoutId);
    };
  }, [isOpen, showSuggestions]);

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
    const sendingAgent = activeAgent;
    const sendingConversationKey = getConversationStorageKey(sendingAgent.id);

    const userMessage: Message = {
      agentId: sendingAgent.id,
      agentName: sendingAgent.name,
      id: (nextMessageIdRef.current++).toString(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    };

    updateConversationMessages(sendingConversationKey, (prev) => [
      ...prev,
      userMessage,
    ]);
    setInputValue("");
    setHiddenSuggestionsKey(promptSuggestionsKey);

    // Simulate AI response
    simulateAIResponse(sendingAgent, sendingConversationKey);
  };

  const simulateAIResponse = (agent: AgentOption, conversationKey: string) => {
    // Add a small delay for realism
    const timeoutId = window.setTimeout(() => {
      responseTimeoutsRef.current = responseTimeoutsRef.current.filter(
        (pendingTimeoutId) => pendingTimeoutId !== timeoutId
      );
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

      updateConversationMessages(conversationKey, (prev) => [...prev, aiMessage]);
    }, 800);
    responseTimeoutsRef.current.push(timeoutId);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleInputChange = (nextValue: string) => {
    setInputValue(nextValue);
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
    setIsAuthCardDismissed(false);
    setIsOpen(true);
    setIsExpanded(false);
    setIsAgentMenuOpen(false);
    onAuthenticate?.();
  };

  const renderedMessages =
    messages.length === 0 ? (
      <div className="flex h-full min-h-[280px] flex-col items-center justify-center px-8 text-center">
        {renderAgentBadge(activeAgent, "empty")}
        <h3 className="mt-5 text-[clamp(1.75rem,2vw+1rem,2rem)] font-semibold leading-none text-[#052049]">
          {activeAgent.name}
        </h3>
        <p className="mt-4 text-[clamp(1.125rem,1vw+0.9rem,1.25rem)] font-semibold leading-tight text-[#052049]">
          {activeExperience.title}
        </p>
        <p className="mx-auto mt-3 max-w-[360px] text-[clamp(0.95rem,0.85rem+0.2vw,1rem)] leading-[1.5] text-[#506380]">
          {activeExperience.introBody}
        </p>
      </div>
    ) : (
      <>
        {messages.map((message) => {
          const messageAgent =
            agentOptions.find((agent) => agent.id === message.agentId) ?? activeAgent;

          return (
            <div
              key={message.id}
              className={`flex flex-col group/msg ${message.sender === "user"
                ? "items-end"
                : "items-stretch"
              }`}
            >
              {message.sender === "versa" && (
                <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-[14px] font-semibold text-[#052049]">
                    {message.agentName ?? messageAgent.name}
                  </span>
                  {messageAgent.id === "digital-a11y" && (
                    <span className="text-[14px] font-medium text-[#506380]">
                      Accessibility and Compliance Support
                    </span>
                  )}
                </div>
              )}

              <div
                className={`relative rounded-2xl py-3 ${message.sender === "user"
                  ? "max-w-[85%] bg-[#EAF3FF] px-4 text-[#052049]"
                  : "w-full bg-[#F2F3F4] px-4 text-[#101828]"
                }`}
              >
                <p className="whitespace-pre-wrap text-base leading-relaxed">{message.text}</p>
                <div className="mt-3 flex items-center gap-2 pt-1">
                  <p className="text-[14px] font-medium text-[#506380]">
                    {formatTime(message.timestamp)}
                  </p>

                  <div className="flex items-center gap-1">
                    {message.sender === "versa" && message.id !== "1" && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleFeedback(message.id, "helpful")}
                          className={`border rounded-none p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006BE9] focus-visible:ring-offset-2 ${
                            message.feedback === "helpful"
                              ? "border-[#178CCB] bg-[#E2F4FC] text-[#052049]"
                              : "border-transparent text-[#506380] hover:bg-[rgba(80,99,128,0.12)] hover:text-[#052049]"
                          }`}
                          title={message.feedback === "helpful" ? "Undo Good response" : "Good response"}
                          aria-label={message.feedback === "helpful" ? "Undo Good response" : "Good response"}
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleFeedback(message.id, "unhelpful")}
                          className={`border rounded-none p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006BE9] focus-visible:ring-offset-2 ${
                            message.feedback === "unhelpful"
                              ? "border-[#178CCB] bg-[#E2F4FC] text-[#052049]"
                              : "border-transparent text-[#506380] hover:bg-[rgba(80,99,128,0.12)] hover:text-[#052049]"
                          }`}
                          title={message.feedback === "unhelpful" ? "Undo Bad response" : "Bad response"}
                          aria-label={message.feedback === "unhelpful" ? "Undo Bad response" : "Bad response"}
                        >
                          <ThumbsDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => handleCopyMessage(message.id, message.text)}
                      className={`border rounded-none p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006BE9] focus-visible:ring-offset-2 ${
                        copiedId === message.id
                          ? "border-transparent text-[#052049]"
                        : message.sender === "user"
                            ? "border-transparent text-[#506380] hover:bg-[rgba(80,99,128,0.12)] hover:text-[#052049]"
                            : "border-transparent text-[#506380] hover:bg-[rgba(80,99,128,0.12)] hover:text-[#052049]"
                      } ${message.sender === "user" ? "active:bg-[#DCE7F2]" : "active:bg-[#E7EAED]"}`}
                      title="Copy"
                      aria-label="Copy"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </>
    );

  // No Access View - Login CTA
  if (!hasAccess) {
    return (
      <>
        {!isAuthCardDismissed && (
          <div className="versa-widget-auth-card fixed z-40 overflow-hidden bg-white text-[#171717] shadow-[0_20px_45px_rgba(5,32,73,0.12)] scheme-light">
            <div className="versa-widget-auth-header relative bg-[#006BE9] text-white">
              <button
                onClick={() => setIsAuthCardDismissed(true)}
                className="versa-widget-auth-close versa-widget-icon-button absolute rounded-none text-white/90 transition-colors hover:text-white"
                aria-label="Dismiss AI Assistant card"
              >
                <X className="versa-widget-icon-xl" strokeWidth={2} />
              </button>

              <div className="flex flex-col items-center justify-center gap-3 pt-2 text-center">
                <div className="versa-widget-auth-badge flex items-center justify-center rounded-full bg-white">
                  <MessageSquare
                    className="versa-widget-auth-badge-icon flex-shrink-0 text-[#006BE9]"
                    strokeWidth={2.25}
                  />
                </div>
              </div>
            </div>

            <div className="versa-widget-auth-body text-center">
              <div className="text-[#052049]">
                <h3 className="versa-widget-auth-title font-semibold leading-[1.05] tracking-[-0.03em] text-[#052049]">
                  Get Help With This Topic
                </h3>
              </div>

              <p className="versa-widget-auth-copy mx-auto font-normal leading-[1.32] tracking-[-0.02em] text-[#667085]">
                {guestBodyCopy}
              </p>

              <div className="versa-widget-auth-cta">
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
            className="versa-widget-launcher group fixed z-40 flex items-center justify-center rounded-full bg-[#006BE9] text-white shadow-lg transition-transform hover:scale-105"
            aria-label="Open AI Assistant login card"
          >
            <MessageSquare className="versa-widget-icon-xl flex-shrink-0 text-white" strokeWidth={2.1} />
            <span className="versa-widget-launcher-label whitespace-nowrap font-semibold leading-none text-white">
              Ask a Question
            </span>
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
          className={`versa-widget-chat fixed z-50 flex flex-col bg-white text-[#171717] shadow-2xl transition-all duration-300 scheme-light ${
            isExpanded 
              ? "versa-widget-chat-expanded"
              : "versa-widget-chat-default"
          }`}
        >
          {/* Header */}
          <div className="versa-widget-header flex flex-shrink-0 items-center justify-between bg-[#052049] text-white">
            <div className="relative mr-auto" ref={agentMenuRef}>
              <button
                type="button"
                className={`flex w-full min-w-0 items-center gap-3 rounded-none px-3 py-2 text-left transition-[color,background-color,border-color,text-decoration-color,fill,stroke] ${
                  activeAgent.id === "digital-a11y" && messages.length === 0
                    ? "focus-visible:outline-none"
                    : "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006BE9] focus-visible:outline-offset-1"
                } focus-visible:bg-transparent ${
                  isAgentMenuOpen
                    ? "bg-white/10"
                    : "hover:bg-white/10"
                }`}
                aria-haspopup="listbox"
                aria-expanded={isAgentMenuOpen}
                onClick={() => setIsAgentMenuOpen((prev) => !prev)}
              >
                <div className="flex-shrink-0">{renderAgentBadge(activeAgent, "header")}</div>
                <div className="flex min-w-0 items-center gap-1.5">
                  <h3 className="versa-widget-header-title truncate font-bold tracking-tight leading-[1.15]">
                    {activeAgent.name}
                  </h3>
                  <ChevronDown
                    className={`versa-widget-icon-sm mt-0.5 flex-shrink-0 text-white/80 transition-transform duration-200 ${
                      isAgentMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              <div
                className={`versa-widget-dropdown absolute left-0 top-full z-20 mt-2 rounded-none bg-white px-4 pb-4 pt-4 shadow-[0_20px_45px_rgba(5,32,73,0.2)] transition-all duration-200 ${
                  isAgentMenuOpen
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-1 opacity-0"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    handleAgentSelect(umbrellaAgent.id);
                  }}
                  className={`flex w-full flex-col px-3 py-2 text-left transition-[color,background-color,border-color,text-decoration-color,fill,stroke] hover:bg-[#F2F3F4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006BE9] focus-visible:outline-offset-1 ${
                    umbrellaAgent.id === activeAgent.id
                      ? "bg-[#EAF3FF]"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-2.5">
                      {renderAgentBadge(umbrellaAgent)}
                      <div className="min-w-0">
                        <span className="block text-[15px] font-semibold leading-tight text-[#052049]">
                          {umbrellaAgent.name}
                        </span>
                        <span className="mt-0.5 block text-[13px] leading-[1.35] text-[#506380]">
                          {umbrellaAgent.description}
                        </span>
                      </div>
                    </div>
                    {umbrellaAgent.id === activeAgent.id ? (
                      <Check
                        className="versa-widget-icon-sm flex-shrink-0 self-center text-[#052049]"
                        strokeWidth={3}
                      />
                    ) : null}
                  </div>
                </button>

                <div className="mt-4 border-t border-[#D9E2EC] pt-4">
                  <p className="mb-2 flex h-10 items-center pb-0 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#506380]">
                    Switch to Another Agent
                  </p>
                </div>
                <div
                  role="listbox"
                  aria-label="Scoped agents"
                  className="-mx-1 -my-1 max-h-[286px] space-y-1 overflow-y-auto px-1 py-1"
                >
                  {orderedScopedAgentOptions.map((agent) => (
                      <button
                        key={agent.id}
                        type="button"
                        onClick={() => {
                          handleAgentSelect(agent.id);
                        }}
                        className={`flex w-full flex-col rounded-none px-3 py-2 text-left transition-[color,background-color,border-color,text-decoration-color,fill,stroke] hover:bg-[#F2F3F4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006BE9] focus-visible:outline-offset-1 ${
                          agent.id === activeAgent.id
                            ? "bg-[#EAF3FF]"
                            : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-start gap-2.5">
                            {renderAgentBadge(agent)}
                            <div className="min-w-0">
                              <span className="block text-[15px] font-semibold leading-tight text-[#052049]">
                                {agent.name}
                              </span>
                              <span className="mt-0.5 block text-[13px] leading-[1.35] text-[#506380]">
                                {agent.description}
                              </span>
                            </div>
                          </div>
                          {agent.id === activeAgent.id ? (
                            <Check
                              className="versa-widget-icon-sm flex-shrink-0 self-center text-[#052049]"
                              strokeWidth={3}
                            />
                          ) : null}
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="versa-widget-icon-button hidden rounded-none transition-[color,background-color,border-color,text-decoration-color,fill,stroke] hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006BE9] focus-visible:outline-offset-1 md:block"
                aria-label={isExpanded ? "Minimize chat" : "Expand chat"}
                title={isExpanded ? "Shrink" : "Expand to fill side"}
              >
                {isExpanded ? (
                  <Minimize2 className="versa-widget-icon-md" />
                ) : (
                  <Maximize2 className="versa-widget-icon-md" />
                )}
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsExpanded(false);
                  setIsAgentMenuOpen(false);
                }}
                className="versa-widget-icon-button rounded-none transition-[color,background-color,border-color,text-decoration-color,fill,stroke] hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006BE9] focus-visible:outline-offset-1"
                aria-label="Close chat"
              >
                <X className="versa-widget-icon-md" />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {/* Messages */}
              <div className="versa-widget-messages flex-1 space-y-4 overflow-y-auto bg-white">
                {renderedMessages}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="versa-widget-input-area flex-shrink-0 border-t-2 border-gray-100 bg-[#F2F3F4]">
                <div className="flex items-stretch">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a question..."
                    className="versa-widget-input flex-1 border-0 border-l-[6px] border-l-[#8B919A] bg-white text-[#052049] placeholder:text-[#052049] focus:outline-none"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim()}
                    className="versa-widget-send-button flex flex-shrink-0 items-center justify-center rounded-none bg-[#3C69D9] text-white transition-[color,background-color,border-color,text-decoration-color,fill,stroke] hover:bg-[#2F58BE] focus-visible:outline focus-visible:outline-[4px] focus-visible:outline-[#006BE9] focus-visible:outline-offset-[3px] focus-visible:ring-[3px] focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Send message"
                  >
                    <Send className="versa-widget-icon-lg" strokeWidth={2.2} />
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="versa-widget-meta-label font-semibold uppercase tracking-[0.08em] text-[#506380]">
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
                      className={`versa-widget-suggestions-toggle relative inline-flex h-4 w-7 items-center rounded-full focus-visible:outline-none transition-[color,background-color,border-color,text-decoration-color,fill,stroke] ${
                        showSuggestions ? "bg-[#006BE9]" : "bg-[#667085]"
                      }`}
                      aria-label={showSuggestions ? "Hide suggested prompts" : "Show suggested prompts"}
                      title={showSuggestions ? "Hide suggested prompts" : "Show suggested prompts"}
                    >
                      <span
                        className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${
                          showSuggestions ? "translate-x-3.5" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out focus-within:overflow-visible ${
                      showSuggestions ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="space-y-2 pb-1">
                      {promptSuggestions.map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => handleSendMessage(prompt)}
                          className="versa-widget-prompt-button flex w-full items-start gap-3 bg-[#F2F3F4] px-3 py-2 text-left text-[#506380] transition-[color,background-color,border-color,text-decoration-color,fill,stroke] hover:bg-[rgba(80,99,128,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006BE9] focus-visible:outline-offset-1"
                        >
                          <MessageSquareMore
                            className="versa-widget-icon-sm mt-0.5 flex-shrink-0 text-[#506380]"
                            strokeWidth={2.1}
                          />
                          <span>{prompt}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="versa-widget-footnote mt-4 text-center leading-tight text-[#475467]">
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
          className={`versa-widget-launcher group fixed z-40 flex items-center justify-center shadow-xl transition-all duration-300 ${
            showBlueMinimizedTrigger
              ? "rounded-full bg-[#006BE9] text-white hover:scale-105"
              : "rounded-full bg-white border-2 border-gray-200 hover:scale-110 animate-pulse-twice"
          }`}
          aria-label="Open AI Assistant"
        >
          {showBlueMinimizedTrigger ? (
            <>
              <MessageSquare className="versa-widget-icon-xl flex-shrink-0 text-white" strokeWidth={2.1} />
              <span className="versa-widget-launcher-label whitespace-nowrap font-semibold leading-none text-white">
                Ask a Question
              </span>
            </>
          ) : (
            <MessageSquare className="versa-widget-icon-xl text-[#006BE9]" strokeWidth={2.1} />
          )}
          {!showBlueMinimizedTrigger && launcherTooltip}
        </button>
      )}
    </>
  );
}
