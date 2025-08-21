import { type User, type InsertUser, type Contact, type InsertContact, type JournalEntry, type InsertJournal, type CVData } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContact(contact: InsertContact): Promise<Contact>;
  getJournalEntries(): Promise<JournalEntry[]>;
  getCVData(): Promise<CVData | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contacts: Map<string, Contact>;
  private journalEntries: JournalEntry[];
  private cvData: CVData | undefined;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.journalEntries = [
      {
        id: "1",
        title: "My Journey into Web Development",
        date: "2024-01-15",
        content: "Starting my career in web development has been an incredible journey. From learning HTML and CSS to mastering JavaScript frameworks, every day brings new challenges and opportunities to grow.",
        createdAt: new Date()
      },
      {
        id: "2",
        title: "Building Networks, Building Futures",
        date: "2024-02-10", 
        content: "My education in Networks and Communication Systems has given me a solid foundation in understanding how technology connects us all. It's fascinating to see how networking principles apply to both technical systems and human relationships.",
        createdAt: new Date()
      },
      {
        id: "3",
        title: "The Power of Problem-Solving",
        date: "2024-03-05",
        content: "Working in IT support has taught me that every problem has a solution. Whether it's troubleshooting a network issue or developing a new feature, the key is to approach challenges with patience and creativity.",
        createdAt: new Date()
      }
    ];

    // Initialize CV data from provided JSON
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
            "period": "May 2024 – Sept 2024",
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
            "period": "Apr 2022 – Oct 2024",
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
      updatedAt: new Date()
    };
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = { 
      ...insertContact, 
      id, 
      createdAt: new Date() 
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getJournalEntries(): Promise<JournalEntry[]> {
    return [...this.journalEntries];
  }

  async getCVData(): Promise<CVData | undefined> {
    return this.cvData;
  }
}

export const storage = new MemStorage();
