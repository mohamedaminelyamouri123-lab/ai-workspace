import { useState } from "react";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles, PieChart, AlertCircle, CheckCircle2, ThumbsUp, BarChart } from "lucide-react";

export default function AnalysisPage() {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<null | {
    sentiment: string;
    score: number;
    keywords: string[];
    readability: string;
    tone: string;
  }>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock result
    setResult({
      sentiment: "Positive",
      score: 85,
      keywords: ["innovative", "growth", "strategy", "efficient", "seamless"],
      readability: "Professional",
      tone: "Confident & Direct"
    });
    setIsAnalyzing(false);
  };

  return (
    <Layout>
      <div className="p-8 max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Text Analysis</h1>
          <p className="text-muted-foreground">Get insights on sentiment, tone, and readability.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Input Text</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea 
                  placeholder="Paste your text here to analyze..." 
                  className="min-h-[300px] resize-none font-mono text-sm leading-relaxed p-4"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{text.length} characters</span>
                  <Button onClick={handleAnalyze} disabled={!text.trim() || isAnalyzing}>
                    {isAnalyzing ? (
                      <>Analyzing...</>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" /> Analyze Text
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {result ? (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-primary" />
                      Analysis Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Sentiment Score</span>
                        <span className="font-bold text-primary">{result.score}/100</span>
                      </div>
                      <Progress value={result.score} className="h-2" />
                      <p className="text-xs text-right text-muted-foreground mt-1">{result.sentiment}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/50 rounded-lg space-y-1">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Tone</span>
                        <div className="font-medium flex items-center gap-2">
                          <ThumbsUp className="w-4 h-4 text-green-500" />
                          {result.tone}
                        </div>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg space-y-1">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Readability</span>
                        <div className="font-medium flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-500" />
                          {result.readability}
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold block mb-3">Key Concepts</span>
                      <div className="flex flex-wrap gap-2">
                        {result.keywords.map(k => (
                          <span key={k} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="h-full border-dashed flex flex-col items-center justify-center p-8 text-center bg-muted/20">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <BarChart className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg">No analysis yet</h3>
                <p className="text-muted-foreground max-w-xs mt-2">
                  Enter text in the panel on the left and click analyze to see detailed insights here.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
