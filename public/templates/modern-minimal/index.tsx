
import React from 'react';
import { TemplateProps } from '@shared/template-types';
import { ContactForm, Section, SkillBadge, ProjectCard, ExperienceCard, EducationCard } from '../shared/components';

export default function ModernMinimalTemplate({ data, theme = 'light', emailJSConfig }: TemplateProps) {
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {data.personal.profileImage && (
            <img
              src={data.personal.profileImage}
              alt={data.personal.name}
              className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-blue-500"
            />
          )}
          <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
            {data.personal.name}
          </h1>
          <p className="text-2xl md:text-3xl text-gray-600 dark:text-gray-400 mb-6">
            {data.personal.title}
          </p>
          {data.personal.bio && (
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              {data.personal.bio}
            </p>
          )}
          
          {/* Contact Info */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {data.personal.email && (
              <a href={`mailto:${data.personal.email}`} className="text-blue-600 hover:underline">
                {data.personal.email}
              </a>
            )}
            {data.personal.phone && (
              <span className="text-gray-600 dark:text-gray-400">{data.personal.phone}</span>
            )}
            {data.personal.location && (
              <span className="text-gray-600 dark:text-gray-400">{data.personal.location}</span>
            )}
          </div>

          {/* Social Links */}
          {data.social && (
            <div className="flex justify-center gap-6 mt-6">
              {data.social.github && (
                <a href={data.social.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                  GitHub
                </a>
              )}
              {data.social.linkedin && (
                <a href={data.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                  LinkedIn
                </a>
              )}
              {data.social.twitter && (
                <a href={data.social.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                  Twitter
                </a>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Skills Section */}
      {data.skills && data.skills.length > 0 && (
        <Section title="Skills" className="container mx-auto px-4 py-12">
          <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
            {data.skills.map((skill, index) => (
              <SkillBadge 
                key={index} 
                skill={skill}
                className={isDark ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'}
              />
            ))}
          </div>
        </Section>
      )}

      {/* Projects Section */}
      {data.projects && data.projects.length > 0 && (
        <Section title="Projects" className="container mx-auto px-4 py-12 bg-gray-50 dark:bg-gray-800">
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {data.projects.map((project, index) => (
              <ProjectCard
                key={index}
                title={project.title}
                description={project.description}
                technologies={project.technologies}
                link={project.liveUrl || project.githubUrl}
                className={isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}
              />
            ))}
          </div>
        </Section>
      )}

      {/* Experience Section */}
      {data.experience && data.experience.length > 0 && (
        <Section title="Experience" className="container mx-auto px-4 py-12">
          <div className="space-y-8 max-w-4xl mx-auto">
            {data.experience.map((exp, index) => (
              <ExperienceCard
                key={index}
                company={exp.company}
                role={exp.title}
                duration={exp.duration}
                description={exp.description}
                className={isDark ? 'border-blue-400' : 'border-blue-600'}
              />
            ))}
          </div>
        </Section>
      )}

      {/* Education Section */}
      {data.education && data.education.length > 0 && (
        <Section title="Education" className="container mx-auto px-4 py-12 bg-gray-50 dark:bg-gray-800">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {data.education.map((edu, index) => (
              <EducationCard
                key={index}
                institution={edu.institution}
                degree={edu.degree}
                duration={edu.year}
                className={isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}
              />
            ))}
          </div>
        </Section>
      )}

      {/* Contact Section */}
      <Section title="Get In Touch" className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <ContactForm 
            userEmail={data.personal.email}
            className={isDark ? 'text-white' : 'text-gray-900'}
          />
        </div>
      </Section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center border-t border-gray-200 dark:border-gray-800">
        <p className="text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} {data.personal.name}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
