import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Loader2, Link as LinkIcon, Sparkles } from "lucide-react";
import { useSendCopilotMessage } from "@workspace/api-client-react";
import { Link } from "wouter";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  relatedModule?: string;
  suggestions?: string[];
}

const QUICK_QUESTIONS = [
  "Which country is best for me?",
  "What is my loan eligibility?",
  "How to improve placement score?",
  "When should I apply?"
];

export default function AICopilotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const sendMessage = useSendCopilotMessage();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = (text: string) => {
    if (!text.trim() || sendMessage.isPending) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    sendMessage.mutate(
      { data: { message: text, history: messages.map(m => ({ role: m.role, content: m.content })) } },
      {
        onSuccess: (data) => {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: data.reply,
              relatedModule: data.relatedModule,
              suggestions: data.suggestions,
            },
          ]);
        },
      }
    );
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-primary text-primary-foreground shadow-[0_0_30px_rgba(0,212,255,0.4)] hover:shadow-[0_0_40px_rgba(0,212,255,0.6)] transition-all flex items-center justify-center"
          >
            <Sparkles className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[550px] max-h-[85vh] flex flex-col shadow-2xl rounded-2xl overflow-hidden border border-border/50"
          >
            <GlassCard className="flex-1 flex flex-col h-full rounded-none border-0">
              <div className="p-4 bg-background/80 backdrop-blur-md border-b border-border/50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">GradPath AI Copilot</h3>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span> Online
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                {messages.length === 0 ? (
                  <div className="flex flex-col h-full justify-center">
                    <div className="text-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-3">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <p className="text-sm text-foreground/80">How can I help with your global education journey today?</p>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {QUICK_QUESTIONS.map((q, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          className="justify-start text-xs h-auto py-2.5 px-3 bg-background/50 border-border hover:border-primary/50 hover:bg-primary/5 whitespace-normal text-left"
                          onClick={() => handleSend(q)}
                        >
                          {q}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, i) => (
                      <div key={i} className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                        <div
                          className={`p-3 rounded-2xl text-sm ${
                            msg.role === 'user'
                              ? 'bg-primary text-primary-foreground rounded-tr-sm'
                              : 'bg-muted/50 border border-border/50 text-foreground/90 rounded-tl-sm'
                          }`}
                        >
                          {msg.content}
                        </div>
                        {msg.relatedModule && (
                          <Link href={msg.relatedModule === 'loan' ? '/loan' : msg.relatedModule === 'career' ? '/career' : msg.relatedModule === 'roi' ? '/roi' : '/dashboard'}>
                            <Button variant="link" className="text-[10px] h-6 px-0 text-primary mt-1 flex items-center gap-1 hover:underline">
                              <LinkIcon className="w-3 h-3" /> View {msg.relatedModule} module
                            </Button>
                          </Link>
                        )}
                        {msg.suggestions && msg.suggestions.length > 0 && i === messages.length - 1 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {msg.suggestions.map((s, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSend(s)}
                                className="text-[10px] px-2 py-1 rounded-full border border-border bg-background/40 hover:bg-primary/10 hover:border-primary/30 transition-colors text-muted-foreground hover:text-primary whitespace-nowrap"
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {sendMessage.isPending && (
                      <div className="flex items-center gap-2 text-muted-foreground text-xs mr-auto bg-muted/30 p-3 rounded-2xl rounded-tl-sm border border-border/50">
                        <Loader2 className="w-3 h-3 animate-spin" /> Thinking...
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="p-3 bg-background/80 backdrop-blur-md border-t border-border/50 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend(input);
                  }}
                  className="relative flex items-center"
                >
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask GradPath AI..."
                    className="pr-10 bg-background border-border/50 focus-visible:ring-primary/30 rounded-full h-10 text-sm"
                    disabled={sendMessage.isPending}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    variant="ghost"
                    disabled={!input.trim() || sendMessage.isPending}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-primary hover:bg-primary/20 hover:text-primary"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}