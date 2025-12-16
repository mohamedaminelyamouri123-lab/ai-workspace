import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { generateChatResponse } from "./gemini";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  setupAuth(app);

  // Get chat history for authenticated user
  app.get("/api/chat/messages", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const messages = await storage.getChatMessages(req.user!.id);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Send a message and get AI response
  app.post("/api/chat/message", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const { content } = req.body;
    if (!content || typeof content !== "string") {
      return res.status(400).json({ message: "Message content is required" });
    }

    try {
      // Save user message
      const userMessage = await storage.addChatMessage({
        userId: req.user!.id,
        role: "user",
        content,
      });

      // Get chat history for context (last 20 messages)
      const history = await storage.getChatMessages(req.user!.id, 20);
      
      // Generate AI response
      const aiResponseText = await generateChatResponse(content, history);

      // Save AI response
      const aiMessage = await storage.addChatMessage({
        userId: req.user!.id,
        role: "assistant",
        content: aiResponseText,
      });

      res.json({
        userMessage,
        aiMessage,
      });
    } catch (error) {
      console.error("Error in chat:", error);
      res.status(500).json({ message: "Failed to process message" });
    }
  });

  // Clear chat history
  app.delete("/api/chat/messages", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      await storage.clearChatHistory(req.user!.id);
      res.sendStatus(200);
    } catch (error) {
      console.error("Error clearing chat:", error);
      res.status(500).json({ message: "Failed to clear chat history" });
    }
  });

  return httpServer;
}
