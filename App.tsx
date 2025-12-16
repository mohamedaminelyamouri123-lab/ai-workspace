import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import ChatPage from "@/pages/chat";
import DocumentsPage from "@/pages/documents";
import DocumentEditor from "@/pages/document-editor";
import AnalysisPage from "@/pages/analysis";
import CodeAssistant from "@/pages/code-assistant";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/chat" component={ChatPage} />
      <ProtectedRoute path="/documents" component={DocumentsPage} />
      <ProtectedRoute path="/documents/new" component={DocumentEditor} />
      <ProtectedRoute path="/documents/:id" component={DocumentEditor} />
      <ProtectedRoute path="/analysis" component={AnalysisPage} />
      <ProtectedRoute path="/code" component={CodeAssistant} />

      <Route path="/">
         <Redirect to="/dashboard" />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster />
        <Router />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
