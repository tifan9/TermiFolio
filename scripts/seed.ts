import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../shared/schema';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Seed CV data
    console.log('📝 Seeding CV data...');
    await db.insert(schema.cvData).values([
      {
        section: 'personal',
        data: {
          name: 'Sophie Uwase',
          title: 'Web Developer & IT Professional',
          email: 'uwasesophie101@gmail.com',
          phone: '+250783199810',
          location: 'Kigali, Rwanda',
          summary: 'Passionate Web Developer and IT Professional with expertise in full-stack development, network administration, and system troubleshooting.'
        }
      },
      {
        section: 'experience',
        data: [
          {
            role: 'Field Support Officer',
            organization: 'International Organization for Migration (IOM)',
            location: 'Kigali, Rwanda',
            period: 'Jan 2025 - Apr 2025',
            achievements: [
              'Assisted in logistical coordination, data collection, and reporting to support program implementation.',
              'Collaborated with teams to resolve operational challenges, leveraging IT skills to troubleshoot technical issues in field settings.',
              'Provided critical field support for operations in Kigali, ensuring compliance with IOM policies and procedures.'
            ]
          },
          {
            role: 'IT Support',
            organization: 'Career Access Africa',
            location: 'Kigali, Rwanda',
            period: 'May 2024 – Sept 2024',
            achievements: [
              'Designed, developed, and launched a user-friendly website tailored to meet Career Access Africa\'s branding and functional needs.',
              'Monitored network and system performance, identifying and resolving anomalies to ensure high availability.',
              'Oversaw IT infrastructure development, implementation, and maintenance for CAA.',
              'Provided strategic oversight for IT operations, including hardware, network configuration, and compliance with IT policies.'
            ]
          },
          {
            role: 'Web Developer',
            organization: 'Kigali Adventist Dental Clinic (KADC)',
            location: 'Kigali, Rwanda',
            period: 'Apr 2022 – Oct 2024',
            achievements: [
              'Designed and developed a dynamic website for the clinic to enhance its online presence, including appointment booking and SEO.',
              'Resolved various technical issues, from hardware/software troubleshooting to ensuring uptime and reliability.',
              'Implemented system monitoring processes, improving uptime and issue resolution speed.',
              'Documented system configurations, troubleshooting processes, and security protocols.'
            ]
          }
        ]
      },
      {
        section: 'education',
        data: [
          {
            degree: 'Bachelor of Networks and Communication Systems',
            institution: 'Adventist University of Central Africa (AUCA)',
            location: 'Kigali, Rwanda',
            period: 'Jan 2021 - Feb 2025',
            courses: [
              'Linux Administration',
              'Network Administration',
              'Network Security',
              'Java Programming',
              'Web Design',
              'Web Technology',
              'Cloud Technologies'
            ]
          },
          {
            program: 'Frontend Development',
            institution: 'Solvit Africa',
            location: 'Kigali, Rwanda',
            period: 'Jul - Sept 2025'
          },
          {
            program: 'Bridge Program (work readiness training)',
            institution: 'Harambee',
            location: 'Kigali, Rwanda',
            period: 'Oct - Dec 2024'
          }
        ]
      },
      {
        section: 'skills',
        data: {
          technical: [
            'Web development (HTML, CSS, PHP, Java, JavaScript)',
            'MySQL Database',
            'Computer Maintenance',
            'Network Configuration',
            'Troubleshooting',
            'Network Security',
            'Server Management'
          ],
          soft: [
            'Teamwork',
            'Time Management',
            'Problem-Solving',
            'Active Listening',
            'Communication Skills',
            'Adaptability'
          ],
          languages: ['Kinyarwanda (Fluent)', 'English (Fluent)']
        }
      }
    ]);

    // Seed journal entries
    console.log('📰 Seeding journal entries...');
    await db.insert(schema.journalEntries).values([
      {
        title: 'My Journey into Web Development',
        content: 'Starting my career in web development has been an incredible journey. From learning HTML and CSS to mastering JavaScript frameworks, every day brings new challenges and opportunities to grow. I\'ve discovered that the key to success in this field is not just technical skills, but also the ability to understand user needs and translate them into intuitive digital experiences.\n\nWhat excites me most about web development is the constant evolution of the field. New frameworks, tools, and best practices emerge regularly, keeping the work fresh and challenging. I\'ve found that staying curious and maintaining a growth mindset is essential for success in this industry.',
        excerpt: 'Starting my career in web development has been an incredible journey of growth and discovery.',
        slug: 'my-journey-into-web-development',
        publishedAt: new Date('2024-01-15'),
      },
      {
        title: 'Building Networks, Building Futures',
        content: 'My education in Networks and Communication Systems has given me a solid foundation in understanding how technology connects us all. It\'s fascinating to see how networking principles apply to both technical systems and human relationships. Whether I\'m configuring a router or collaborating with a team, the same principles of clear communication and reliable connections apply.\n\nThe coursework at AUCA has been comprehensive, covering everything from Linux administration to network security. Each subject builds upon the previous one, creating a holistic understanding of how modern IT infrastructure works. This knowledge has proven invaluable in my professional roles.',
        excerpt: 'Understanding how technology connects us through networks and communication systems.',
        slug: 'building-networks-building-futures',
        publishedAt: new Date('2024-02-10'),
      },
      {
        title: 'The Power of Problem-Solving',
        content: 'Working in IT support has taught me that every problem has a solution. Whether it\'s troubleshooting a network issue or developing a new feature, the key is to approach challenges with patience and creativity. I\'ve learned to break down complex problems into smaller, manageable pieces and tackle them systematically.\n\nOne of the most rewarding aspects of IT work is the moment when you finally solve a challenging problem. The process of investigation, hypothesis testing, and solution implementation mirrors the scientific method, making each day feel like a mini research project. This analytical approach has served me well across all my roles.',
        excerpt: 'Every problem has a solution when approached with patience and systematic thinking.',
        slug: 'the-power-of-problem-solving',
        publishedAt: new Date('2024-03-05'),
      }
    ]);

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run seed if called directly
if (require.main === module) {
  seed().catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
}

export default seed;