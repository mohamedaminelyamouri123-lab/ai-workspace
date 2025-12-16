import Layout from "@/components/layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, FileText, Code, BarChart, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const tools = [
    {
      title: "AI Chat Assistant",
      description: "Chat with your advanced AI assistant for general queries and help.",
      icon: MessageSquare,
      href: "/chat",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Document Writer",
      description: "Draft, edit, and refine documents with AI-powered suggestions.",
      icon: FileText,
      href: "/documents",
      color: "text-green-500",
      bg: "bg-green-500/10"
    },
    {
      title: "Code Assistant",
      description: "Generate, debug, and optimize code snippets in multiple languages.",
      icon: Code,
      href: "/code",
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    {
      title: "Text Analysis",
      description: "Analyze sentiment, tone, and key insights from any text.",
      icon: BarChart,
      href: "/analysis",
      color: "text-orange-500",
      bg: "bg-orange-500/10"
    }
  ];

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your personal AI workspace.</p>
        </div>

        {/* Quick Stats or Highlights could go here */}
        <Card className="bg-gradient-to-br from-primary/20 via-primary/5 to-background border-primary/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
          <CardContent className="p-8 flex items-center justify-between relative z-10">
            <div className="space-y-4 max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                <Sparkles className="w-3 h-3" />
                <span>New Features Available</span>
              </div>
              <h2 className="text-2xl font-bold">Boost your productivity with AI</h2>
              <p className="text-muted-foreground">
                Start a new chat, draft a document, or analyze text with our suite of intelligent tools designed to help you work faster.
              </p>
              <Link href="/chat">
                <Button className="mt-2">Start Chatting <ArrowRight className="w-4 h-4 ml-2" /></Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <Link key={tool.title} href={tool.href}>
              <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer group">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${tool.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <tool.icon className={`w-6 h-6 ${tool.color}`} />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
