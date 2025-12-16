import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ChatMessage } from "@shared/schema";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat/messages"],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", "/api/chat/message", { content });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/messages"] });
    },
  });

  const clearHistoryMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/chat/messages");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/messages"] });
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || sendMessageMutation.isPending) return;

    const userMsg = input;
    setInput("");
    setIsTyping(true);

    try {
      await sendMessageMutation.mutateAsync(userMsg);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Layout>
      <div className="flex h-full">
        <div className="flex-1 flex flex-col h-full relative">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <h1 className="font-semibold">AI Chat</h1>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => clearHistoryMutation.mutate()}
              disabled={clearHistoryMutation.isPending || messages.length === 0}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Chat
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="max-w-3xl mx-auto space-y-6 pb-20">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Bot className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Start a conversation</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Ask me anything! I can help with writing, coding, analysis, and more.
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-4 w-full",
                      msg.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {msg.role === "assistant" && (
                      <Avatar className="w-8 h-8 border bg-primary text-primary-foreground">
                        <AvatarFallback><Bot className="w-4 h-4" /></AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div
                      className={cn(
                        "rounded-2xl px-5 py-3 max-w-[80%] shadow-sm",
                        msg.role === "user" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted/50 border"
                      )}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap text-sm">{msg.content}</p>
                    </div>

                    {msg.role === "user" && (
                      <Avatar className="w-8 h-8 border bg-muted">
                        <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))
              )}
              
              {isTyping && (
                <div className="flex gap-4 w-full justify-start">
                   <Avatar className="w-8 h-8 border bg-primary text-primary-foreground">
                      <AvatarFallback><Bot className="w-4 h-4" /></AvatarFallback>
                    </Avatar>
                    <div className="bg-muted/50 border rounded-2xl px-5 py-3 flex items-center gap-1">
                      <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <div className="p-4 bg-background border-t">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSend} className="relative flex items-center">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="pr-12 py-6 rounded-full bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary/20 shadow-sm"
                  data-testid="input-message"
                  disabled={sendMessageMutation.isPending}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={!input.trim() || sendMessageMutation.isPending}
                  className="absolute right-2 rounded-full h-8 w-8"
                  data-testid="button-send"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Powered by Google Gemini
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
