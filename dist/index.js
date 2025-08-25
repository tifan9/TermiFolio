// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  users;
  contacts;
  journalEntries;
  cvData;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.contacts = /* @__PURE__ */ new Map();
    this.journalEntries = [
      {
        id: "1",
        title: "My Journey into Web Development",
        date: "2024-01-15",
        content: "Starting my career in web development has been an incredible journey. From learning HTML and CSS to mastering JavaScript frameworks, every day brings new challenges and opportunities to grow.",
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: "2",
        title: "Building Networks, Building Futures",
        date: "2024-02-10",
        content: "My education in Networks and Communication Systems has given me a solid foundation in understanding how technology connects us all. It's fascinating to see how networking principles apply to both technical systems and human relationships.",
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: "3",
        title: "The Power of Problem-Solving",
        date: "2024-03-05",
        content: "Working in IT support has taught me that every problem has a solution. Whether it's troubleshooting a network issue or developing a new feature, the key is to approach challenges with patience and creativity.",
        createdAt: /* @__PURE__ */ new Date()
      }
    ];
    this.cvData = {
      id: "cv-1",
      data: {
        "name": "Sophie Uwase",
        "contact": {
          "phone": "+250783199810",
          "email": "uwasesophie101@gmail.com"
        },
        "experience": [
          {
            "role": "Field Support Officer",
            "organization": "International Organization for Migration (IOM)",
            "location": "Kigali, Rwanda",
            "period": "Jan 2025 - Apr 2025",
            "achievements": [
              "Assisted in logistical coordination, data collection, and reporting to support program implementation.",
              "Collaborated with teams to resolve operational challenges, leveraging IT skills to troubleshoot technical issues in field settings.",
              "Provided critical field support for operations in Kigali, ensuring compliance with IOM policies and procedures."
            ]
          },
          {
            "role": "IT Support",
            "organization": "Career Access Africa",
            "location": "Kigali, Rwanda",
            "period": "May 2024 \u2013 Sept 2024",
            "achievements": [
              "Designed, developed, and launched a user-friendly website tailored to meet Career Access Africa's branding and functional needs.",
              "Monitored network and system performance, identifying and resolving anomalies to ensure high availability.",
              "Oversaw IT infrastructure development, implementation, and maintenance for CAA.",
              "Provided strategic oversight for IT operations, including hardware, network configuration, and compliance with IT policies."
            ]
          },
          {
            "role": "Web Developer",
            "organization": "Kigali Adventist Dental Clinic (KADC)",
            "location": "Kigali, Rwanda",
            "period": "Apr 2022 \u2013 Oct 2024",
            "achievements": [
              "Designed and developed a dynamic website for the clinic to enhance its online presence, including appointment booking and SEO.",
              "Resolved various technical issues, from hardware/software troubleshooting to ensuring uptime and reliability.",
              "Implemented system monitoring processes, improving uptime and issue resolution speed.",
              "Documented system configurations, troubleshooting processes, and security protocols."
            ]
          }
        ],
        "education": [
          {
            "degree": "Bachelor of Networks and Communication Systems",
            "institution": "Adventist University of Central Africa (AUCA)",
            "location": "Kigali, Rwanda",
            "period": "Jan 2021 - Feb 2025",
            "courses": [
              "Linux Administration",
              "Network Administration",
              "Network Security",
              "Java Programming",
              "Web Design",
              "Web Technology",
              "Cloud Technologies"
            ]
          },
          {
            "program": "Frontend Development",
            "institution": "Solvit Africa",
            "location": "Kigali, Rwanda",
            "period": "Jul - Sept 2025"
          },
          {
            "program": "Bridge Program (work readiness training)",
            "institution": "Harambee",
            "location": "Kigali, Rwanda",
            "period": "Oct - Dec 2024"
          },
          {
            "certificate": "Advanced Network Operations",
            "institution": "Internet Society",
            "location": "Kigali, Rwanda",
            "period": "Sept - Oct 2024"
          },
          {
            "certificate": "Linux Administration",
            "institution": "Cisco Academy",
            "location": "Kigali, Rwanda",
            "period": "Sept - Dec 2022"
          },
          {
            "bootcamp": "Cyber Security",
            "institution": "Shield Tech Hub",
            "location": "Kigali, Rwanda",
            "period": "2021"
          }
        ],
        "skills": {
          "technical": [
            "Web development (HTML, CSS, PHP, Java, JavaScript)",
            "MySQL Database",
            "Computer Maintenance",
            "Network Configuration",
            "Troubleshooting",
            "Network Security",
            "Server Management"
          ],
          "soft": [
            "Teamwork",
            "Time Management",
            "Problem-Solving",
            "Active Listening",
            "Communication Skills",
            "Adaptability"
          ],
          "languages": ["Kinyarwanda (Fluent)", "English (Fluent)"]
        },
        "references": [
          {
            "name": "Iraturagiye Emmanuella",
            "role": "Operations Manager",
            "organization": "Career Access Africa",
            "phone": "+250784046464"
          },
          {
            "name": "Ishimwe Pacifique",
            "role": "Facilitator",
            "organization": "SheCanCode",
            "email": "ishimwepacifique0@gmail.com",
            "phone": "+250787334843"
          }
        ]
      },
      updatedAt: /* @__PURE__ */ new Date()
    };
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = randomUUID();
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  async createContact(insertContact) {
    const id = randomUUID();
    const contact = {
      ...insertContact,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.contacts.set(id, contact);
    return contact;
  }
  async getJournalEntries() {
    return [...this.journalEntries];
  }
  async getCVData() {
    return this.cvData;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, varchar, timestamp, jsonb, serial, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  message: text("message").notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  status: varchar("status", { length: 20 }).default("new").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var journalEntries = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  status: varchar("status", { length: 20 }).default("published").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  publishedAt: timestamp("published_at")
});
var cvData = pgTable("cv_data", {
  id: serial("id").primaryKey(),
  section: varchar("section", { length: 50 }).notNull(),
  data: jsonb("data").notNull(),
  version: integer("version").default(1).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  eventType: varchar("event_type", { length: 50 }).notNull(),
  eventData: jsonb("event_data"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  sessionId: varchar("session_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true
});
var insertJournalEntrySchema = createInsertSchema(journalEntries).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertCvDataSchema = createInsertSchema(cvData).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// server/routes.ts
import { z } from "zod";
async function registerRoutes(app2) {
  app2.get("/api/cv", async (req, res) => {
    try {
      const cvData2 = await storage.getCVData();
      if (!cvData2) {
        return res.status(404).json({ message: "CV data not found" });
      }
      res.json(cvData2.data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch CV data" });
    }
  });
  app2.get("/api/journal", async (req, res) => {
    try {
      const entries = await storage.getJournalEntries();
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch journal entries" });
    }
  });
  app2.post("/api/contact", async (req, res) => {
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
  app2.post("/api/ask", async (req, res) => {
    try {
      const { question } = req.body;
      if (!question || typeof question !== "string") {
        return res.status(400).json({ message: "Question is required" });
      }
      const response = handleAIQuestion(question);
      res.json({ response });
    } catch (error) {
      res.status(500).json({ message: "Failed to process question" });
    }
  });
  app2.get("/api/profiles", async (req, res) => {
    const profiles = {
      "GitHub": "https://github.com/sophieuwase",
      "LinkedIn": "https://linkedin.com/in/sophieuwase",
      "Behance": "https://behance.net/sophieuwase",
      "Kaggle": "https://kaggle.com/sophieuwase",
      "HuggingFace": "https://huggingface.co/sophieuwase"
    };
    res.json(profiles);
  });
  const httpServer = createServer(app2);
  return httpServer;
}
function handleAIQuestion(question) {
  const q = question.toLowerCase();
  if (q.includes("experience") || q.includes("work")) {
    return `I have experience as a Field Support Officer at IOM, IT Support at Career Access Africa, and Web Developer at KADC. I specialize in web development, network administration, and IT support.`;
  } else if (q.includes("skill") || q.includes("technology")) {
    return `My technical skills include web development (HTML, CSS, PHP, Java, JavaScript), MySQL Database, Network Configuration, and Server Management. I also have strong soft skills in teamwork, problem-solving, and communication.`;
  } else if (q.includes("education") || q.includes("study")) {
    return `I'm pursuing a Bachelor's degree in Networks and Communication Systems at AUCA, with additional training in Frontend Development, Linux Administration, and Cyber Security.`;
  } else if (q.includes("contact") || q.includes("reach")) {
    return `You can reach me at uwasesophie101@gmail.com or +250783199810. Feel free to use the /contact command to send me a message!`;
  } else if (q.includes("rwanda") || q.includes("kigali")) {
    return `Yes, I'm based in Kigali, Rwanda. I've worked with several local organizations including Career Access Africa and Kigali Adventist Dental Clinic.`;
  } else {
    return `I'm Sophie Uwase, a passionate Web Developer and IT Professional from Rwanda. For specific information, try asking about my experience, skills, education, or contact details. You can also use /cv to see my full resume.`;
  }
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "3001", 10);
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
})();
