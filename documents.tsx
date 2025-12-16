import { useState } from "react";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileText, Plus, Search, MoreVertical, Calendar } from "lucide-react";
import { format } from "date-fns";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Link } from "wouter";

interface Document {
  id: string;
  title: string;
  content: string;
  updatedAt: Date;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      title: "Project Notes",
      content: "## Q1 Goals\n\n1. Launch MVP\n2. Gather feedback\n3. Iterate on core features",
      updatedAt: new Date(),
    }
  ]);
  const [search, setSearch] = useState("");

  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(search.toLowerCase()) || 
    doc.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
            <p className="text-muted-foreground">Manage and edit your written content.</p>
          </div>
          <Link href="/documents/new">
            <Button className="gap-2" data-testid="button-new-document">
              <Plus className="w-4 h-4" /> New Document
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-4 bg-card p-2 rounded-lg border shadow-sm max-w-md">
          <Search className="w-4 h-4 text-muted-foreground ml-2" />
          <Input 
            placeholder="Search documents..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-none shadow-none focus-visible:ring-0 h-auto py-1"
            data-testid="input-search"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <Card key={doc.id} className="group hover:border-primary/50 transition-colors cursor-pointer" data-testid={`card-document-${doc.id}`}>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <FileText className="w-5 h-5" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Open</DropdownMenuItem>
                      <DropdownMenuItem>Rename</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">{doc.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1 h-10">
                    {doc.content}
                  </p>
                </div>

                <div className="flex items-center text-xs text-muted-foreground pt-4 border-t">
                  <Calendar className="w-3 h-3 mr-1" />
                  Edited {format(doc.updatedAt, "MMM d, yyyy")}
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Link href="/documents/new">
            <div className="h-full min-h-[200px] rounded-xl border border-dashed border-muted-foreground/25 flex flex-col items-center justify-center gap-4 hover:bg-muted/50 hover:border-primary/50 transition-all cursor-pointer text-muted-foreground hover:text-primary">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <p className="font-medium">Create New Document</p>
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
