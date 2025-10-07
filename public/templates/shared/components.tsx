// Shared components that templates can import
import emailjs from '@emailjs/browser';

export interface ContactFormProps {
  userEmail?: string;
  className?: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export function ContactForm({ userEmail, className = '', onSuccess, onError }: ContactFormProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    try {
      // Get EmailJS credentials from environment or use defaults
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_default';
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_default';
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'default_key';

      await emailjs.sendForm(serviceId, templateId, form, publicKey);
      
      if (onSuccess) onSuccess();
      form.reset();
    } catch (error) {
      if (onError) onError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <input type="hidden" name="to_email" value={userEmail || ''} />
      
      <div className="space-y-4">
        <div>
          <label htmlFor="from_name" className="block text-sm font-medium mb-1">
            Your Name
          </label>
          <input
            type="text"
            id="from_name"
            name="from_name"
            required
            className="w-full px-3 py-2 border rounded-md"
            data-testid="input-contact-name"
          />
        </div>

        <div>
          <label htmlFor="from_email" className="block text-sm font-medium mb-1">
            Your Email
          </label>
          <input
            type="email"
            id="from_email"
            name="from_email"
            required
            className="w-full px-3 py-2 border rounded-md"
            data-testid="input-contact-email"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            className="w-full px-3 py-2 border rounded-md"
            data-testid="input-contact-message"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          data-testid="button-contact-submit"
        >
          Send Message
        </button>
      </div>
    </form>
  );
}

export interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({ title, children, className = '' }: SectionProps) {
  return (
    <section className={`py-8 ${className}`}>
      <h2 className="text-3xl font-bold mb-6">{title}</h2>
      {children}
    </section>
  );
}

export interface SkillBadgeProps {
  skill: string;
  className?: string;
}

export function SkillBadge({ skill, className = '' }: SkillBadgeProps) {
  return (
    <span className={`inline-block px-3 py-1 bg-gray-200 rounded-full text-sm ${className}`}>
      {skill}
    </span>
  );
}

export interface ProjectCardProps {
  title: string;
  description: string;
  technologies?: string[];
  link?: string;
  className?: string;
}

export function ProjectCard({ title, description, technologies = [], link, className = '' }: ProjectCardProps) {
  return (
    <div className={`border rounded-lg p-6 ${className}`}>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      
      {technologies.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {technologies.map((tech, i) => (
            <SkillBadge key={i} skill={tech} />
          ))}
        </div>
      )}
      
      {link && (
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          View Project →
        </a>
      )}
    </div>
  );
}

export interface ExperienceCardProps {
  company: string;
  role: string;
  duration: string;
  description: string;
  className?: string;
}

export function ExperienceCard({ company, role, duration, description, className = '' }: ExperienceCardProps) {
  return (
    <div className={`border-l-4 border-blue-600 pl-4 py-2 ${className}`}>
      <h3 className="text-xl font-semibold">{role}</h3>
      <p className="text-gray-600">{company} • {duration}</p>
      <p className="mt-2">{description}</p>
    </div>
  );
}

export interface EducationCardProps {
  institution: string;
  degree: string;
  duration: string;
  className?: string;
}

export function EducationCard({ institution, degree, duration, className = '' }: EducationCardProps) {
  return (
    <div className={`border rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold">{degree}</h3>
      <p className="text-gray-600">{institution}</p>
      <p className="text-sm text-gray-500">{duration}</p>
    </div>
  );
}
