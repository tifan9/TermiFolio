import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MailService } from '@sendgrid/mail';
import OpenAI from 'openai';

// Initialize services
let mailService: MailService | null = null;
let openai: OpenAI | null = null;

if (process.env.SENDGRID_API_KEY) {
  mailService = new MailService();
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

if (process.env.OPENAI_API_KEY) {
  // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// In-memory storage for demo (replace with database in production)
const storage = {
  journalEntries: [
    {
      id: "1",
      title: "My Journey into Web Development",
      date: "2024-01-15",
      content: "Starting my career in web development has been an incredible journey. From learning HTML and CSS to mastering JavaScript frameworks, every day brings new challenges and opportunities to grow.",
      createdAt: new Date("2024-01-15")
    },
    {
      id: "2",
      title: "Building Networks, Building Futures",
      date: "2024-02-10",
      content: "My education in Networks and Communication Systems has given me a solid foundation in understanding how technology connects us all. It's fascinating to see how networking principles apply to both technical systems and human relationships.",
      createdAt: new Date("2024-02-10")
    },
    {
      id: "3",
      title: "The Power of Problem-Solving",
      date: "2024-03-05",
      content: "Working in IT support has taught me that every problem has a solution. Whether it's troubleshooting a network issue or developing a new feature, the key is to approach challenges with patience and creativity.",
      createdAt: new Date("2024-03-05")
    }
  ],
  cvData: {
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
    }
  }
};

// AI Q&A function with OpenAI integration
async function handleAIQuestion(question: string): Promise<string> {
  if (openai) {
    try {
      const prompt = `You are Sophie Uwase, a passionate Web Developer and IT Professional from Rwanda. Based on the following CV information, answer the question naturally and personally:

      Name: Sophie Uwase
      Current Role: Field Support Officer at IOM (International Organization for Migration)
      Education: Bachelor of Networks and Communication Systems at AUCA
      Skills: Web development, Network Administration, IT Support, System Troubleshooting
      
      Previous Experience:
      - IT Support at Career Access Africa
      - Web Developer at Kigali Adventist Dental Clinic
      
      Question: ${question}
      
      Answer as Sophie in first person, keeping it friendly and professional:`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.7
      });

      return response.choices[0].message.content || "I'd be happy to help! Could you rephrase your question?";
    } catch (error) {
      console.error('OpenAI API error:', error);
      return fallbackAIResponse(question);
    }
  }
  
  return fallbackAIResponse(question);
}

// Fallback AI response for when OpenAI is not available
function fallbackAIResponse(question: string): string {
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url, method } = req;
  const path = url?.replace('/api/', '').replace(/^\//,'') || '';

  try {
    switch (method) {
      case 'GET':
        if (path === 'cv') {
          return res.json(storage.cvData);
        } else if (path === 'journal') {
          return res.json(storage.journalEntries);
        } else if (path === 'profiles') {
          const profiles = {
            'GitHub': 'https://github.com/tifan9',
            'LinkedIn': 'https://linkedin.com/in/sophieuwase',
            'Behance': 'https://behance.net/sophieuwase',
            'Kaggle': 'https://kaggle.com/sophieuwase',
            'HuggingFace': 'https://huggingface.co/sophieuwase'
          };
          return res.json(profiles);
        }
        break;

      case 'POST':
        if (path === 'contact') {
          const { name, email, message } = req.body;
          
          if (!name || !email || !message) {
            return res.status(400).json({ message: 'Missing required fields' });
          }

          // Send email using SendGrid if configured
          if (mailService && process.env.SENDGRID_FROM_EMAIL) {
            try {
              await mailService.send({
                to: 'uwasesophie101@gmail.com',
                from: process.env.SENDGRID_FROM_EMAIL,
                subject: `Portfolio Contact: ${name}`,
                html: `
                  <h2>New Contact Form Submission</h2>
                  <p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Message:</strong></p>
                  <p>${message.replace(/\n/g, '<br>')}</p>
                `,
                text: `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
              });
              
              console.log('Email sent successfully via SendGrid');
            } catch (emailError) {
              console.error('SendGrid email error:', emailError);
              // Don't fail the request if email fails, just log it
            }
          }

          return res.json({ 
            message: 'Message sent successfully!', 
            id: Date.now().toString() 
          });
        } else if (path === 'ask') {
          const { question } = req.body;
          
          if (!question || typeof question !== 'string') {
            return res.status(400).json({ message: 'Question is required' });
          }

          const response = await handleAIQuestion(question);
          return res.json({ response });
        }
        break;

      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }

    return res.status(404).json({ message: 'Endpoint not found' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}