import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface FAQItem {
  question: string;
  answer: string;
  keywords?: string[];
}

interface FAQSectionProps {
  title?: string;
  faqs: FAQItem[];
  className?: string;
}

export function FAQSection({ title = "Frequently Asked Questions", faqs, className = "" }: FAQSectionProps) {
  return (
    <Card className={className} data-testid="faq-section">
      <CardHeader>
        <CardTitle className="text-2xl" data-testid="text-faq-title">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} data-testid={`faq-item-${index}`}>
              <AccordionTrigger className="text-left hover:no-underline" data-testid={`faq-question-${index}`}>
                <span className="font-medium">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground" data-testid={`faq-answer-${index}`}>
                <div className="pt-2">
                  {faq.answer}
                  {faq.keywords && faq.keywords.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {faq.keywords.map((keyword, i) => (
                        <span 
                          key={i} 
                          className="text-xs px-2 py-1 bg-muted rounded-md"
                          data-testid={`faq-keyword-${index}-${i}`}
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

// Predefined FAQ data for different pages
export const jobsFAQs: FAQItem[] = [
  {
    question: "How do I apply for jobs listed on this platform?",
    answer: "Click on any job listing to view full details. You'll find an 'Apply Now' button that will redirect you to the company's application page or job portal. Make sure your resume is updated and tailored to the position.",
    keywords: ["job application", "apply online", "career opportunities", "job search"]
  },
  {
    question: "Are these job listings verified?",
    answer: "Yes, we verify all job listings before publishing them on our platform. However, we recommend doing your own research about the company before applying. Check company reviews, official websites, and verify the job posting through multiple sources.",
    keywords: ["verified jobs", "authentic listings", "job verification", "trusted employers"]
  },
  {
    question: "How often are new jobs posted?",
    answer: "New job opportunities are added daily. We recommend checking the platform regularly or enabling email notifications to stay updated about the latest openings that match your profile.",
    keywords: ["new jobs", "job updates", "daily postings", "job notifications"]
  },
  {
    question: "Can I filter jobs by location and experience level?",
    answer: "Absolutely! Use our advanced filters to search jobs by location, experience level (fresher/experienced), job type (full-time, part-time, remote), salary range, and specific skills or technologies.",
    keywords: ["job filters", "search jobs", "location based", "experience level", "remote jobs"]
  },
  {
    question: "What should I include in my job application?",
    answer: "A strong application includes a tailored resume highlighting relevant experience, a well-written cover letter explaining your interest in the role, and any portfolio links or certifications that demonstrate your skills. Use our Resume Reviewer tool to optimize your resume.",
    keywords: ["resume tips", "cover letter", "job application tips", "career advice"]
  }
];

export const fresherJobsFAQs: FAQItem[] = [
  {
    question: "What qualifies as a 'fresher' job?",
    answer: "Fresher jobs are entry-level positions designed for recent graduates or individuals with 0-2 years of professional experience. These roles typically provide training and mentorship to help you build your career.",
    keywords: ["fresher jobs", "entry level", "recent graduate", "first job", "career start"]
  },
  {
    question: "Do I need prior experience to apply for fresher positions?",
    answer: "No, fresher positions don't require prior work experience. However, relevant internships, academic projects, certifications, and skills development can strengthen your application significantly.",
    keywords: ["no experience", "fresher requirements", "entry level jobs", "graduate jobs"]
  },
  {
    question: "How can I make my application stand out as a fresher?",
    answer: "Focus on your academic achievements, personal projects, internships, and relevant skills. Highlight your learning ability, enthusiasm, and any technical or soft skills. Use our Portfolio Builder to showcase your projects professionally.",
    keywords: ["fresher tips", "application tips", "stand out", "portfolio", "skills showcase"]
  },
  {
    question: "What is the typical salary range for fresher jobs?",
    answer: "Fresher salaries vary by industry, location, and skillset. In tech, freshers can expect ₹3-6 LPA in India. Check individual job listings for specific salary information. Focus on learning opportunities alongside compensation.",
    keywords: ["fresher salary", "entry level pay", "compensation", "package details"]
  },
  {
    question: "Are remote fresher jobs available?",
    answer: "Yes! Many companies now offer remote positions for freshers, especially in tech, digital marketing, content writing, and customer support. Use our location filter to find 'Remote' or 'Work from Home' opportunities.",
    keywords: ["remote jobs", "work from home", "fresher remote", "online jobs"]
  }
];

export const internshipsFAQs: FAQItem[] = [
  {
    question: "What types of internships are available?",
    answer: "We list various internship types including paid internships, unpaid/academic credit internships, part-time, full-time, remote, and in-office internships across multiple domains like tech, marketing, design, finance, and more.",
    keywords: ["internship types", "paid internship", "remote internship", "summer internship"]
  },
  {
    question: "How long do internships typically last?",
    answer: "Internship duration varies by company and program. Most internships last 2-6 months. Summer internships are typically 2-3 months, while academic internships may extend to 6 months or match semester schedules.",
    keywords: ["internship duration", "internship period", "summer training", "6 month internship"]
  },
  {
    question: "Will I receive a certificate after completing an internship?",
    answer: "Most companies provide completion certificates and letters of recommendation upon successful internship completion. Some may also offer pre-placement offers (PPO) or job opportunities based on performance.",
    keywords: ["internship certificate", "letter of recommendation", "PPO", "internship completion"]
  },
  {
    question: "Can I do an internship while studying?",
    answer: "Yes! Many part-time and remote internships are designed for students. They offer flexible hours so you can balance academics and practical experience. Look for 'Part-time' or 'Flexible hours' tags in listings.",
    keywords: ["part time internship", "student internship", "flexible internship", "study work balance"]
  },
  {
    question: "Do internships lead to full-time jobs?",
    answer: "Many companies use internships as a recruitment pipeline. Strong performance during internships often leads to pre-placement offers (PPO) or full-time job offers. Even without PPO, internship experience significantly boosts your job prospects.",
    keywords: ["PPO", "full time job", "internship to job", "placement after internship"]
  }
];

export const roadmapsFAQs: FAQItem[] = [
  {
    question: "How do I use the learning roadmaps?",
    answer: "Each roadmap provides a step-by-step learning path for a specific technology or career. Click on nodes to access resources, tutorials, and practice problems. Follow the sequence for structured learning, or customize based on your current skill level.",
    keywords: ["learning path", "career roadmap", "skill development", "tech roadmap", "study guide"]
  },
  {
    question: "Can I customize roadmaps based on my skill level?",
    answer: "Yes! Roadmaps are designed with different difficulty levels (Beginner, Intermediate, Advanced). You can start at any level based on your current knowledge and skip sections you're already familiar with.",
    keywords: ["custom roadmap", "skill level", "beginner roadmap", "advanced learning"]
  },
  {
    question: "How long does it take to complete a roadmap?",
    answer: "Completion time varies by roadmap complexity and your learning pace. Most roadmaps show estimated duration. Typically, fundamental roadmaps take 3-6 months with consistent daily practice, while specialized ones may take 2-4 months.",
    keywords: ["learning duration", "roadmap time", "study timeline", "learning schedule"]
  },
  {
    question: "Are roadmaps updated with latest technologies?",
    answer: "Yes! Our roadmaps are regularly updated to reflect current industry trends, new technologies, and best practices. Each roadmap shows the last update date. We also incorporate feedback from industry professionals.",
    keywords: ["updated content", "latest tech", "current trends", "modern stack", "industry standard"]
  },
  {
    question: "Can I track my progress on roadmaps?",
    answer: "Yes, create an account to track your progress through roadmaps. Mark completed sections, save resources for later, and see how far you've progressed. You can also earn completion certificates for finished roadmaps.",
    keywords: ["progress tracking", "learning tracker", "completion certificate", "milestone tracking"]
  }
];

export const articlesFAQs: FAQItem[] = [
  {
    question: "What topics do the articles cover?",
    answer: "Our articles cover a wide range of topics including technical tutorials, career advice, interview preparation, industry insights, technology trends, coding best practices, and professional development tips.",
    keywords: ["tech articles", "career tips", "interview prep", "coding tutorials", "industry news"]
  },
  {
    question: "How often are new articles published?",
    answer: "We publish new articles regularly, with multiple articles added each week. Subscribe to our newsletter or follow us to get notified about the latest content that matches your interests.",
    keywords: ["new articles", "article updates", "content schedule", "tech blog", "weekly posts"]
  },
  {
    question: "Can I contribute articles to the platform?",
    answer: "Yes! We welcome contributions from industry professionals and experienced developers. Contact our team through the support page to learn about our contributor guidelines and submission process.",
    keywords: ["contribute article", "guest post", "write article", "content contribution"]
  },
  {
    question: "Are articles written by industry experts?",
    answer: "Yes, our articles are written by experienced professionals, industry experts, and verified contributors. Each article includes author credentials and expertise to help you assess the content quality.",
    keywords: ["expert articles", "professional content", "industry experts", "verified authors"]
  },
  {
    question: "Can I bookmark articles for later reading?",
    answer: "Absolutely! Create an account to bookmark articles, create reading lists, and save content for offline reading. You can organize bookmarks by topics and share them with your network.",
    keywords: ["bookmark articles", "save articles", "reading list", "offline reading"]
  }
];

export const dsaFAQs: FAQItem[] = [
  {
    question: "What difficulty levels are available for DSA problems?",
    answer: "Problems are categorized into Easy, Medium, and Hard difficulty levels. Start with Easy problems to build fundamentals, then progress to Medium and Hard as you gain confidence. Each problem shows estimated solving time.",
    keywords: ["DSA difficulty", "easy problems", "hard problems", "problem levels", "coding practice"]
  },
  {
    question: "Do DSA problems include solutions and explanations?",
    answer: "Yes! Each problem includes detailed solutions with multiple approaches, time/space complexity analysis, step-by-step explanations, and tips for optimization. You can also view community solutions.",
    keywords: ["DSA solutions", "code explanations", "algorithm analysis", "optimization tips"]
  },
  {
    question: "Which programming languages are supported?",
    answer: "Problems can be solved in multiple languages including C++, Java, Python, JavaScript, and more. Solutions are provided in the most common languages, but you can practice in your preferred language.",
    keywords: ["coding languages", "C++ problems", "Python DSA", "Java algorithms", "JavaScript practice"]
  },
  {
    question: "How are DSA problems relevant to job interviews?",
    answer: "Our DSA problems are curated based on frequently asked interview questions from top tech companies. Each problem includes company tags (Google, Amazon, Microsoft, etc.) to help you prepare for specific company interviews.",
    keywords: ["interview preparation", "coding interview", "FAANG questions", "company specific", "job prep"]
  },
  {
    question: "Can I track my DSA practice progress?",
    answer: "Yes! Create an account to track solved problems, view your statistics, see weak areas, and get personalized practice recommendations. You can also compete with friends and join coding challenges.",
    keywords: ["progress tracking", "DSA stats", "practice analytics", "coding challenges", "problem tracker"]
  }
];
