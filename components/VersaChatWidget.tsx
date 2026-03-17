"use client";

import React from "react";
import { X, Send, MessageSquare, ThumbsUp, ThumbsDown, Maximize2, Minimize2, Copy, Check, Edit2, Undo2 } from "lucide-react";
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
  edited?: boolean;
}

export function VersaChatWidget({
  hasAccess,
  onRequestAccess,
}: VersaChatWidgetProps) {
  const launcherTooltip = (
    <div className="absolute bottom-full right-0 mb-3 w-max max-w-[90vw] rounded-2xl border border-[#D1D3D3] bg-white px-5 py-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-left">
      <p className="m-0 text-[18px] leading-[1.1] font-semibold text-[#303030]">
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
      text: "Hi! I'm Versa, your AI assistant for MyAccess. I can help you find applications, answer questions about UCSF resources, and guide you through common tasks. How can I assist you today?",
      sender: "versa",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editInputValue, setEditInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLTextAreaElement>(null);

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

  const startEditing = (id: string, text: string) => {
    setEditingMessageId(id);
    setEditInputValue(text);
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditInputValue("");
  };

  const saveEdit = (id: string) => {
    if (!editInputValue.trim()) return;
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, text: editInputValue, edited: true } : msg
      )
    );
    simulateAIResponse(editInputValue);
    cancelEditing();
  };

  useEffect(() => {
    if (editingMessageId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.setSelectionRange(
        editInputRef.current.value.length,
        editInputRef.current.value.length
      );
    }
  }, [editingMessageId]);

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
          <div className="fixed bottom-6 right-6 z-40 w-[min(420px,calc(100vw-2rem))] rounded-none bg-white border border-gray-200 px-7 pt-5 pb-6 shadow-xl">
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
                Ask Versa AI
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
            className="group fixed bottom-6 right-6 z-40 h-16 w-16 rounded-full bg-[#006BE9] p-3.5 transition-transform hover:scale-105 shadow-lg"
            aria-label="Open AI Assistant authentication card"
          >
            <MessageSquare className="h-full w-full text-white" strokeWidth={2.25} />
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
          className={`fixed bottom-0 right-0 md:bottom-16 md:right-6 bg-white border-2 border-gray-200 transition-all duration-300 z-50 flex flex-col shadow-2xl ${
            isExpanded 
              ? "w-full md:w-[600px] h-full md:h-[calc(100vh-8rem)]" 
              : "w-full md:w-96 h-full md:h-[600px]"
          }`}
        >
          {/* Header */}
          <div className="bg-[#052049] text-white px-5 py-4 flex items-center justify-between flex-shrink-0 -mt-[2px] -mx-[2px] border-2 border-[#052049]">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" strokeWidth={2.25} />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">
                  Versa AI Assistant
                </h3>
                <p className="text-xs text-white/80 mt-0.5">
                  Online • Ready to help
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
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
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
                <X className="w-4 h-4" />
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
                      className={`relative max-w-[85%] rounded-2xl px-4 py-3 transition-shadow ${message.sender === "user"
                          ? "bg-[#052049] text-white shadow-md"
                          : "bg-white border-2 border-gray-200 text-gray-900 shadow-sm"
                        } ${editingMessageId === message.id ? "ring-2 ring-blue-400 !max-w-[95%] w-full" : ""}`}
                    >
                      {message.sender === "versa" && (
                        <div className="flex items-center gap-2 mb-2">
                          <img
                            src="/assets/versa-logo.png"
                            alt="Versa"
                            className="w-4 h-4 object-contain"
                          />
                          <span className="text-xs font-semibold text-[#052049]">
                            Versa
                          </span>
                        </div>
                      )}

                      {editingMessageId === message.id ? (
                        <div className="flex flex-col gap-2">
                           <textarea
                            ref={editInputRef}
                            value={editInputValue}
                            onChange={(e) => setEditInputValue(e.target.value)}
                            className="w-full bg-white/10 text-white border border-white/20 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/50 min-h-[80px] resize-none"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                saveEdit(message.id);
                              }
                              if (e.key === "Escape") {
                                cancelEditing();
                              }
                            }}
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={cancelEditing}
                              className="px-3 py-1 rounded-md text-xs font-medium bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1"
                            >
                              <Undo2 className="w-3 h-3" />
                              Cancel
                            </button>
                            <button
                              onClick={() => saveEdit(message.id)}
                              className="px-3 py-1 rounded-md text-xs font-medium bg-white text-[#052049] hover:bg-white/90 transition-colors flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                          {message.edited && message.sender === "user" && (
                            <span className="text-[10px] italic opacity-50 block mt-1">Edited</span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Meta Row (Below Bubble) */}
                    <div className={`flex items-center mt-1.5 px-1 gap-3 ${editingMessageId === message.id ? "hidden" : ""}`}>
                      <p className="text-[10px] text-gray-400">
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

                        {/* Edit Button (User only) */}
                        {message.sender === "user" && (
                          <button
                            onClick={() => startEditing(message.id, message.text)}
                            className="p-1 rounded-md text-gray-400 hover:text-[#006BE9] hover:bg-blue-50 transition-all"
                            title="Edit message"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}

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
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
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
                        className="w-full text-left px-3 py-2 bg-gray-50 rounded-lg text-xs text-gray-600 transition-colors border border-gray-200 hover:bg-gray-100 hover:border-gray-300 shadow-sm"
                      >
                        How do I request access to an application?
                      </button>
                      <button
                        onClick={() => handleSendMessage("Show me research tools")}
                        className="w-full text-left px-3 py-2 bg-gray-50 rounded-lg text-xs text-gray-600 transition-colors border border-gray-200 hover:bg-gray-100 hover:border-gray-300 shadow-sm"
                      >
                        Show me research tools
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-end gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#18A1CD]/30 focus:border-[#18A1CD] text-sm transition-all"
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

                <p className="text-[10px] text-gray-400 mt-4 text-center leading-tight">
                  AI responses may vary. Always verify critical information.
                </p>
              </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-none w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-[#D1D3D3] shadow-2xl">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[#052049] font-bold text-xl">Help us improve</h3>
                <button 
                  onClick={() => setShowFeedbackModal(false)}
                  className="p-2 hover:bg-gray-100 transition-colors rounded-full"
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
                  variant="ghost"
                  onClick={() => {
                    setShowFeedbackModal(false);
                    setFeedbackText("");
                  }}
                  className="!rounded-none"
                >
                  Skip
                </Button>
                <Button
                  variant="primarySolid"
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
          className={`group fixed bottom-6 right-6 rounded-full transition-all duration-300 hover:scale-110 flex items-center justify-center z-40 shadow-xl ${
            showBlueMinimizedTrigger
              ? "w-16 h-16 bg-[#006BE9]"
              : "w-16 h-16 bg-white border-2 border-gray-200"
          }`}
          aria-label="Open Versa AI Assistant"
        >
          {showBlueMinimizedTrigger ? (
            <MessageSquare className="w-8 h-8 text-white" strokeWidth={2.25} />
          ) : (
            <img
              src="/assets/versa-logo.png"
              alt="Versa AI"
              className="w-10 h-10 object-contain"
            />
          )}
          {launcherTooltip}
        </button>
      )}
    </>
  );
}
