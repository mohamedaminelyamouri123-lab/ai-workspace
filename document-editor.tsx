import { useState } from "react";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, Bot, Save } from "lucide-react";
import { useLocation } from "wouter";

export default function DocumentEditor() {
  const [, setLocation] = useLocation();
  const [title, setTitle] = useState("Untitled Document");
  const [content, setContent] = useState("Start writing here...");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSaving(false);
    setLocation("/documents");
  };

  return (
    <Layout>
      <div className="h-full flex flex-col">
        {/* Toolbar */}
        <div className="border-b bg-background p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="font-bold text-lg border-transparent hover:border-input focus:border-input w-full max-w-sm h-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Bot className="w-4 h-4 mr-2 text-primary" /> AI Assist
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        {/* Formatting Bar */}
        <div className="border-b bg-muted/20 p-2 flex items-center gap-2">
          <ToggleGroup type="multiple" size="sm" variant="outline">
            <ToggleGroupItem value="bold" aria-label="Toggle bold">
              <Bold className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Toggle italic">
              <Italic className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Toggle underline">
              <Underline className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <div className="w-px h-6 bg-border mx-2" />
          <ToggleGroup type="single" size="sm" variant="outline">
            <ToggleGroupItem value="left" aria-label="Align left">
              <AlignLeft className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="center" aria-label="Align center">
              <AlignCenter className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="right" aria-label="Align right">
              <AlignRight className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
           <div className="w-px h-6 bg-border mx-2" />
           <ToggleGroup type="single" size="sm" variant="outline">
            <ToggleGroupItem value="list" aria-label="List">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Editor Area */}
        <div className="flex-1 bg-background p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto h-full min-h-[500px] shadow-sm bg-card rounded-lg border p-12">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full resize-none border-none focus:ring-0 bg-transparent text-lg leading-relaxed outline-none"
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
