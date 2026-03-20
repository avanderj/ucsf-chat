"use client";

import React from "react";
import { X, Send, MessageSquare, ThumbsUp, ThumbsDown, Maximize2, Minimize2, Copy, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/Button";

interface VersaChatWidgetProps {
  hasAccess: boolean;
  onRequestAccess?: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "versa";
  timestamp: Date;
  feedback?: "helpful" | "unhelpful";
}

export function VersaChatWidget({
  hasAccess,
  onRequestAccess,
}: VersaChatWidgetProps) {
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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm Digital A11y, your AI assistant for MyAccess. I can help you find applications, answer questions about UCSF resources, and guide you through common tasks. How can I assist you today?",
      sender: "versa",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackMessageId, setFeedbackMessageId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");

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

  const handleSendMessage = (text?: string) => {
    const messageText = typeof text === "string" ? text : inputValue;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate AI response
    simulateAIResponse(messageText);
  };

  const simulateAIResponse = (query: string) => {
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
        id: (Date.now() + 1).toString(),
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
    onRequestAccess?.();
  };

  // No Access View - Documentation Link
  if (!hasAccess) {
    return (
      <>
        {!isAuthCardDismissed && (
          <div className="fixed bottom-6 right-6 z-40 w-[min(420px,calc(100vw-2rem))] rounded-none bg-white border border-gray-200 px-7 pt-5 pb-6 shadow-xl text-[#171717] scheme-light">
            <button
              onClick={() => setIsAuthCardDismissed(true)}
              className="absolute right-4 top-4 rounded-md p-1 text-[#506380] transition-colors hover:text-[#052049]"
              aria-label="Dismiss AI Assistant card"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex justify-center">
              <div className="h-14 w-14 rounded-full bg-[#006BE9] p-3">
                <MessageSquare
                  className="h-full w-full text-white"
                  strokeWidth={2.25}
                />
              </div>
            </div>

            <div className="mt-3 text-center">
              <h3 className="text-[22px] font-semibold leading-none text-[#052049]">
                Ask Digital A11y
              </h3>
              <p className="mt-4 text-[16px] leading-[1.4] text-[#6B778C]">
                AI-powered guidance to help navigate MyAccess.
              </p>
            </div>

            <div className="mt-7">
              <Button
                variant="primary"
                onClick={handleNonAuthAuthenticate}
                className="!h-[52px] !w-full !rounded-none !text-[18px]"
                aria-label="Request AI Assistant access"
              >
                Request Access
              </Button>
            </div>
          </div>
        )}

        {isAuthCardDismissed && (
          <button
            onClick={() => setIsAuthCardDismissed(false)}
            className="group fixed bottom-6 right-6 z-40 rounded-full bg-[#006BE9] p-3.5 transition-transform hover:scale-105 shadow-lg flex items-center justify-center"
            style={{ width: '88px', height: '88px' }}
            aria-label="Open AI Assistant authentication card"
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
          className={`fixed bottom-0 right-0 md:bottom-8 md:right-8 bg-white border-2 border-gray-200 transition-all duration-300 z-50 flex flex-col shadow-2xl text-[#171717] scheme-light rounded-t-xl md:rounded-t-2xl ${
            isExpanded 
              ? "w-full md:w-[850px] h-full md:h-[85vh]" 
              : "w-full md:w-[490px] h-full md:h-[800px] md:max-h-[85vh]"
          }`}
        >
          {/* Header */}
          <div className="bg-[#052049] text-white px-5 py-5 flex items-center justify-between flex-shrink-0 -mt-[2px] -mx-[2px] border-2 border-[#052049]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-[#006BE9]" strokeWidth={2.25} />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-bold text-[18px] tracking-tight leading-none">
                  Ask Digital A11y
                </h3>
                <p className="text-[16px] text-white/80 leading-none">
                  Accessibility &amp; Compliance Support
                </p>
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
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex flex-col group/msg ${message.sender === "user"
                        ? "items-end"
                        : "items-start"
                      }`}
                  >
                    {/* Chat Bubble */}
                    <div
                      className={`relative max-w-[85%] rounded-2xl px-4 py-3 ${message.sender === "user"
                          ? "bg-[#052049] text-white"
                          : "bg-white border-2 border-gray-200 text-gray-900"
                        }`}
                    >
                      {message.sender === "versa" && (
                        <div className="flex items-center gap-2 mb-2">
                          <img
                            src="/assets/versa-logo.png"
                            alt="Digital A11y"
                            className="w-5 h-5 object-contain"
                          />
                          <span className="text-xs font-semibold text-[#052049]">
                            Digital A11y
                          </span>
                        </div>
                      )}

                      <p className="text-base leading-relaxed whitespace-pre-wrap">{message.text}</p>
                    </div>

                    {/* Meta Row (Below Bubble) */}
                    <div className={`flex items-center mt-1.5 px-1 gap-3 ${message.id === "1" ? "hidden" : ""}`}>
                      <p className="text-[14px] text-gray-400">
                        {formatTime(message.timestamp)}
                      </p>

                      <div className="flex items-center gap-1">
                        {/* Copy Button */}
                        <button
                          onClick={() => handleCopyMessage(message.id, message.text)}
                          className="p-1 rounded-md text-gray-400 hover:text-[#006BE9] hover:bg-blue-50 transition-all"
                          title="Copy message"
                        >
                          {copiedId === message.id ? (
                              <Check className="w-3.5 h-3.5 text-green-500" />
                          ) : (
                              <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>


                        {/* AI Feedback */}
                        {message.sender === "versa" && message.id !== "1" && (
                          <div className="flex items-center gap-1 ml-1 border-l border-gray-200 pl-1">
                            {(!message.feedback || message.feedback === "helpful") && (
                              <button
                                onClick={() => handleFeedback(message.id, "helpful")}
                                className={`p-1 rounded-md transition-all hover:bg-gray-100 ${
                                  message.feedback === "helpful" ? "text-[#006BE9] bg-blue-50" : "text-gray-400"
                                }`}
                                title={message.feedback === "helpful" ? "Undo helpful selection" : "Helpful"}
                              >
                                <ThumbsUp className={`w-3.5 h-3.5 ${message.feedback === "helpful" ? "fill-current" : ""}`} />
                              </button>
                            )}
                            {(!message.feedback || message.feedback === "unhelpful") && (
                              <button
                                onClick={() => handleFeedback(message.id, "unhelpful")}
                                className={`p-1 rounded-md transition-all hover:bg-gray-100 ${
                                  message.feedback === "unhelpful" ? "text-red-500 bg-red-50" : "text-gray-400"
                                }`}
                                title={message.feedback === "unhelpful" ? "Undo unhelpful selection" : "Not helpful"}
                              >
                                <ThumbsDown className={`w-3.5 h-3.5 ${message.feedback === "unhelpful" ? "fill-current" : ""}`} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t-2 border-gray-100 p-4 bg-white flex-shrink-0">
                <div className="mb-4 space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                      Suggested prompts
                    </span>
                    <button
                      onClick={() => setShowSuggestions(!showSuggestions)}
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

                  {/* Collapsible suggested prompts */}
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      showSuggestions ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="space-y-2 pb-1">
                      <button
                        onClick={() =>
                          handleSendMessage("How do I request access to an application?")
                        }
                        className="w-full text-left px-3 py-2 bg-gray-50 rounded-lg text-base text-gray-600 transition-colors border border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                      >
                        How do I request access to an application?
                      </button>
                      <button
                        onClick={() => handleSendMessage("Show me research tools")}
                        className="w-full text-left px-3 py-2 bg-gray-50 rounded-lg text-base text-gray-600 transition-colors border border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                      >
                        Show me research tools
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006BE9]/20 focus:border-[#006BE9] text-base transition-all"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim()}
                    className="p-3 bg-[#006BE9] text-white rounded-xl hover:bg-[#0F388A] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-lg"
                    aria-label="Send message"
                  >
                    <Send className="w-5 h-5" strokeWidth={2.5} />
                  </button>
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
                We're sorry this response wasn't helpful. Please tell us more about what was missing or incorrect.
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
          onClick={() => setIsOpen(true)}
          style={{ width: '88px', height: '88px' }}
          className={`group fixed bottom-6 right-6 rounded-full transition-all duration-300 hover:scale-110 flex items-center justify-center z-40 shadow-xl animate-pulse-twice ${
            showBlueMinimizedTrigger
              ? "bg-[#006BE9]"
              : "bg-white border-2 border-gray-200"
          }`}
          aria-label="Open Digital A11y Assistant"
        >
          {showBlueMinimizedTrigger ? (
            <MessageSquare className="w-[46px] h-[46px] text-white" strokeWidth={2} />
          ) : (
            <img
              src="/assets/versa-logo.png"
              alt="Digital A11y"
              className="w-10 h-10 object-contain"
            />
          )}
          {launcherTooltip}
        </button>
      )}
    </>
  );
}
