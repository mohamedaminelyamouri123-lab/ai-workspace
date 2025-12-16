import { useState } from "react";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Terminal, Copy, Bot, Check } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

export default function CodeAssistant() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(`// Write your code here
function calculateFibonacci(n) {
  if (n <= 1) return n;
  return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);
}

console.log(calculateFibonacci(10));`);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [chatInput, setChatInput] = useState("");

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("");
    // Simulate execution
    await new Promise(resolve => setTimeout(resolve, 1000));
    setOutput("55\n\nProcess exited with code 0");
    setIsRunning(false);
  };

  return (
    <Layout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b bg-background p-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-semibold px-2">Code Assistant</h1>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[180px] h-8">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="go">Go</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" onClick={() => navigator.clipboard.writeText(code)}>
              <Copy className="w-4 h-4 mr-2" /> Copy
            </Button>
            <Button size="sm" onClick={handleRun} disabled={isRunning} className="bg-green-600 hover:bg-green-700 text-white">
              <Play className="w-4 h-4 mr-2" /> Run Code
            </Button>
          </div>
        </div>

        {/* Main Editor Area */}
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={60} minSize={30}>
             <div className="h-full flex flex-col">
                <div className="flex-1 bg-[#1e1e1e] text-[#d4d4d4] p-4 font-mono text-sm overflow-hidden relative">
                   {/* Simple line numbers */}
                   <div className="absolute left-0 top-4 bottom-0 w-12 text-right pr-3 text-[#858585] select-none">
                      {code.split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
                   </div>
                   <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-full bg-transparent resize-none outline-none pl-12"
                    spellCheck={false}
                   />
                </div>
                
                {/* Output Terminal */}
                <div className="h-1/3 border-t bg-black p-4 font-mono text-sm text-green-400 overflow-y-auto">
                   <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Terminal className="w-4 h-4" />
                      <span>Console Output</span>
                   </div>
                   <pre>{output || "Waiting for output..."}</pre>
                </div>
             </div>
          </ResizablePanel>
          
          <ResizableHandle />
          
          <ResizablePanel defaultSize={40} minSize={20}>
            <div className="h-full flex flex-col bg-background border-l">
               <div className="p-4 border-b font-medium flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary" /> AI Assistant
               </div>
               <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                     <div className="bg-muted p-3 rounded-lg text-sm">
                        Hello! I can help you debug this code, explain it, or suggest optimizations. What would you like to do?
                     </div>
                     <div className="bg-primary/10 text-primary p-3 rounded-lg text-sm ml-8">
                        Can you explain how this recursive function works?
                     </div>
                     <div className="bg-muted p-3 rounded-lg text-sm">
                        Certainly! This is a recursive implementation of the Fibonacci sequence.
                        <br/><br/>
                        1. Base case: If n &lt;= 1, it returns n directly.
                        <br/>
                        2. Recursive step: It calls itself twice: calculateFibonacci(n-1) + calculateFibonacci(n-2).
                        <br/><br/>
                        It has a time complexity of O(2^n), which is exponential.
                     </div>
                  </div>
               </ScrollArea>
               <div className="p-4 border-t">
                  <div className="flex gap-2">
                     <input 
                        className="flex-1 bg-muted px-3 py-2 rounded-md text-sm outline-none focus:ring-1 ring-primary"
                        placeholder="Ask about your code..."
                     />
                     <Button size="sm">Send</Button>
                  </div>
               </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </Layout>
  );
}
