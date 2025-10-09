import React, { useState } from 'react';

interface TemplateProps {
  data: {
    personal: {
      name: string;
      title: string;
      bio?: string;
      email: string;
      phone?: string;
      location?: string;
      website?: string;
      profileImage?: string;
    };
    skills: string[];
    projects: Array<{
      title: string;
      description: string;
      technologies: string[];
      githubUrl?: string;
      liveUrl?: string;
      imageUrl?: string;
    }>;
    experience: Array<{
      title: string;
      company: string;
      duration: string;
      description: string;
    }>;
    education: Array<{
      degree: string;
      institution: string;
      year: string;
    }>;
    social?: {
      github?: string;
      linkedin?: string;
      twitter?: string;
    };
  };
  theme?: 'light' | 'dark';
}

const Briefcase = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
);

const Mail = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
);

const Github = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
);

const Linkedin = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
);

export default function CreativeProfessionalTemplate({ data, theme = 'light' }: TemplateProps) {
  const [activePage, setActivePage] = useState('home');

  const bgGradient = theme === 'dark' 
    ? 'bg-gradient-to-br from-purple-900 via-gray-900 to-blue-900' 
    : 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50';

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-lg ${theme === 'dark' ? 'bg-gray-900/80' : 'bg-white/80'} shadow-sm`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              {data.personal.name.split(' ')[0]}
            </span>
            <div className="flex gap-6">
              {['home', 'about', 'work', 'contact'].map((page) => (
                <button
                  key={page}
                  onClick={() => setActivePage(page)}
                  className={`capitalize transition-all ${
                    activePage === page
                      ? 'text-purple-600 font-semibold'
                      : theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Home Page */}
      {activePage === 'home' && (
        <section className={`min-h-screen pt-16 ${bgGradient}`}>
          <div className="max-w-6xl mx-auto px-4 py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center min-h-[calc(100vh-10rem)]">
              <div>
                <h1 className={`text-6xl md:text-7xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {data.personal.name}
                </h1>
                <div className="text-3xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 font-semibold">
                  {data.personal.title}
                </div>
                {data.personal.bio && (
                  <p className={`text-xl mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {data.personal.bio}
                  </p>
                )}
                <div className="flex gap-4">
                  <button 
                    onClick={() => setActivePage('work')}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
                  >
                    View My Work
                  </button>
                  <button 
                    onClick={() => setActivePage('contact')}
                    className={`px-8 py-3 border-2 border-purple-600 rounded-full font-semibold ${theme === 'dark' ? 'text-white hover:bg-purple-600/20' : 'text-purple-600 hover:bg-purple-50'} transition-all`}
                  >
                    Get In Touch
                  </button>
                </div>
              </div>
              <div className="relative">
                {data.personal.profileImage ? (
                  <img
                    src={data.personal.profileImage}
                    alt={data.personal.name}
                    className="rounded-3xl shadow-2xl w-full h-auto object-cover"
                  />
                ) : (
                  <div className={`rounded-3xl h-96 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-2xl flex items-center justify-center`}>
                    <span className="text-6xl">👨‍💼</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* About Page */}
      {activePage === 'about' && (
        <section className={`min-h-screen pt-24 pb-12 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold mb-12">About Me</h2>
            
            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <div className="mb-16">
                <h3 className="text-2xl font-semibold mb-6">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-3">
                  {data.skills.map((skill, index) => (
                    <span
                      key={index}
                      className={`px-6 py-3 rounded-full font-medium ${theme === 'dark' ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700'}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
              <div className="mb-16">
                <h3 className="text-2xl font-semibold mb-6">Experience</h3>
                <div className="space-y-6">
                  {data.experience.map((exp, index) => (
                    <div key={index} className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <h4 className="text-xl font-semibold">{exp.title}</h4>
                      <p className="text-purple-600 font-medium mt-1">{exp.company}</p>
                      <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{exp.duration}</p>
                      <p className={`mt-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <div>
                <h3 className="text-2xl font-semibold mb-6">Education</h3>
                <div className="space-y-4">
                  {data.education.map((edu, index) => (
                    <div key={index} className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <h4 className="text-xl font-semibold">{edu.degree}</h4>
                      <p className="text-purple-600 font-medium mt-1">{edu.institution}</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Work Page */}
      {activePage === 'work' && (
        <section className={`min-h-screen pt-24 pb-12 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold mb-12">My Work</h2>
            {data.projects && data.projects.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-8">
                {data.projects.map((project, index) => (
                  <div
                    key={index}
                    className={`group rounded-3xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} hover:shadow-2xl transition-all`}
                  >
                    {project.imageUrl ? (
                      <img src={project.imageUrl} alt={project.title} className="w-full h-64 object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-64 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                        <Briefcase className="w-16 h-16 text-white" />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-2xl font-semibold mb-3">{project.title}</h3>
                      <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech, i) => (
                          <span key={i} className={`text-xs px-3 py-1 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-700'}`}>
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-4">
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 font-medium">
                            View Live →
                          </a>
                        )}
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 font-medium">
                            <Github className="w-5 h-5 inline" /> Code
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>No projects to display yet.</p>
            )}
          </div>
        </section>
      )}

      {/* Contact Page */}
      {activePage === 'contact' && (
        <section className={`min-h-screen pt-24 pb-12 ${bgGradient}`}>
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl font-bold mb-8 text-center">Let's Connect</h2>
            <p className={`text-xl text-center mb-12 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Have a project in mind? Let's work together!
            </p>
            <div className={`p-8 rounded-3xl ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white/80'} backdrop-blur-lg`}>
              <div className="grid md:grid-cols-2 gap-8">
                {data.personal.email && (
                  <a href={`mailto:${data.personal.email}`} className="flex items-center gap-4 p-6 rounded-2xl hover:bg-purple-600/10 transition-all">
                    <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">Email</div>
                      <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{data.personal.email}</div>
                    </div>
                  </a>
                )}
                {data.social?.github && (
                  <a href={data.social.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-6 rounded-2xl hover:bg-purple-600/10 transition-all">
                    <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
                      <Github className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">GitHub</div>
                      <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>View Profile</div>
                    </div>
                  </a>
                )}
                {data.social?.linkedin && (
                  <a href={data.social.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-6 rounded-2xl hover:bg-purple-600/10 transition-all">
                    <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
                      <Linkedin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">LinkedIn</div>
                      <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Connect</div>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className={`py-8 ${theme === 'dark' ? 'bg-gray-900 border-t border-gray-800' : 'bg-white border-t border-gray-200'}`}>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            © {new Date().getFullYear()} {data.personal.name}. Crafted with passion.
          </p>
        </div>
      </footer>
    </div>
  );
}
