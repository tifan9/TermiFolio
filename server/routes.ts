import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get CV data
  app.get("/api/cv", async (req, res) => {
    try {
      const cvData = await storage.getCVData();
      if (!cvData) {
        return res.status(404).json({ message: "CV data not found" });
      }
      res.json(cvData.data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch CV data" });
    }
  });

  // Get journal entries
  app.get("/api/journal", async (req, res) => {
    try {
      const entries = await storage.getJournalEntries();
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch journal entries" });
    }
  });

  // Submit contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.json({ message: "Message sent successfully!", id: contact.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // AI Q&A endpoint
  app.post("/api/ask", async (req, res) => {
    try {
      const { question } = req.body;
      if (!question || typeof question !== 'string') {
        return res.status(400).json({ message: "Question is required" });
      }

      const response = handleAIQuestion(question);
      res.json({ response });
    } catch (error) {
      res.status(500).json({ message: "Failed to process question" });
    }
  });

  // Get social media profiles
  app.get("/api/profiles", async (req, res) => {
    const profiles = {
      'GitHub': 'https://github.com/sophieuwase',
      'LinkedIn': 'https://linkedin.com/in/sophieuwase',
      'Behance': 'https://behance.net/sophieuwase',
      'Kaggle': 'https://kaggle.com/sophieuwase',
      'HuggingFace': 'https://huggingface.co/sophieuwase'
    };
    res.json(profiles);
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Simple AI Q&A system
function handleAIQuestion(question: string): string {
  const q = question.toLowerCase();
  
  if (q.includes('experience') || q.includes('work')) {
    return `I have experience as a Field Support Officer at IOM, IT Support at Career Access Africa, and Web Developer at KADC. I specialize in web development, network administration, and IT support.`;
  } else if (q.includes('skill') || q.includes('technology')) {
    return `My technical skills include web development (HTML, CSS, PHP, Java, JavaScript), MySQL Database, Network Configuration, and Server Management. I also have strong soft skills in teamwork, problem-solving, and communication.`;
  } else if (q.includes('education') || q.includes('study')) {
    return `I'm pursuing a Bachelor's degree in Networks and Communication Systems at AUCA, with additional training in Frontend Development, Linux Administration, and Cyber Security.`;
  } else if (q.includes('contact') || q.includes('reach')) {
    return `You can reach me at uwasesophie101@gmail.com or +250783199810. Feel free to use the /contact command to send me a message!`;
  } else if (q.includes('rwanda') || q.includes('kigali')) {
    return `Yes, I'm based in Kigali, Rwanda. I've worked with several local organizations including Career Access Africa and Kigali Adventist Dental Clinic.`;
  } else {
    return `I'm Sophie Uwase, a passionate Web Developer and IT Professional from Rwanda. For specific information, try asking about my experience, skills, education, or contact details. You can also use /cv to see my full resume.`;
  }
}
