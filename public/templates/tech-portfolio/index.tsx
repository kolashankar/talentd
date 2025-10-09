import React, { useState, useEffect } from 'react';

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

const Terminal = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
);

const Code = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
);

const Folder = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
);

export default function TechPortfolioTemplate({ data }: TemplateProps) {
  const [command, setCommand] = useState('');
  const [currentPage, setCurrentPage] = useState('~');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    `Welcome to ${data.personal.name}'s Portfolio Terminal`,
    `Type 'help' for available commands`,
    ''
  ]);

  const commands: Record<string, () => string[]> = {
    help: () => [
      'Available commands:',
      '  about     - Display information about me',
      '  skills    - List my technical skills',
      '  projects  - Show my projects',
      '  experience - Display work experience',
      '  contact   - Show contact information',
      '  clear     - Clear terminal',
      ''
    ],
    about: () => [
      `Name: ${data.personal.name}`,
      `Title: ${data.personal.title}`,
      data.personal.bio ? `Bio: ${data.personal.bio}` : '',
      data.personal.location ? `Location: ${data.personal.location}` : '',
      ''
    ].filter(Boolean),
    skills: () => [
      'Technical Skills:',
      ...data.skills.map((skill, i) => `  ${i + 1}. ${skill}`),
      ''
    ],
    projects: () => {
      const output = ['My Projects:', ''];
      data.projects.forEach((project, i) => {
        output.push(`${i + 1}. ${project.title}`);
        output.push(`   ${project.description}`);
        output.push(`   Tech: ${project.technologies.join(', ')}`);
        if (project.liveUrl) output.push(`   Live: ${project.liveUrl}`);
        if (project.githubUrl) output.push(`   Code: ${project.githubUrl}`);
        output.push('');
      });
      return output;
    },
    experience: () => {
      const output = ['Work Experience:', ''];
      data.experience.forEach((exp, i) => {
        output.push(`${i + 1}. ${exp.title} @ ${exp.company}`);
        output.push(`   Duration: ${exp.duration}`);
        output.push(`   ${exp.description}`);
        output.push('');
      });
      return output;
    },
    contact: () => [
      'Contact Information:',
      `  Email: ${data.personal.email}`,
      data.personal.phone ? `  Phone: ${data.personal.phone}` : '',
      data.social?.github ? `  GitHub: ${data.social.github}` : '',
      data.social?.linkedin ? `  LinkedIn: ${data.social.linkedin}` : '',
      ''
    ].filter(Boolean),
    clear: () => {
      setTerminalOutput([]);
      return [];
    }
  };

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const newOutput = [...terminalOutput, `$ ${cmd}`];
    
    if (trimmedCmd === 'clear') {
      setTerminalOutput([]);
      return;
    }
    
    if (commands[trimmedCmd]) {
      setTerminalOutput([...newOutput, ...commands[trimmedCmd]()]);
    } else if (trimmedCmd) {
      setTerminalOutput([...newOutput, `Command not found: ${cmd}`, `Type 'help' for available commands`, '']);
    } else {
      setTerminalOutput(newOutput);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-green-400 font-mono">
      {/* Header Bar */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-gray-400 text-sm">{data.personal.name}@portfolio:~$</span>
        </div>
        <div className="flex gap-4 text-xs text-gray-500">
          <button onClick={() => setCurrentPage('~')} className={currentPage === '~' ? 'text-green-400' : 'hover:text-gray-300'}>Terminal</button>
          <button onClick={() => setCurrentPage('visual')} className={currentPage === 'visual' ? 'text-green-400' : 'hover:text-gray-300'}>Visual</button>
        </div>
      </div>

      {currentPage === '~' ? (
        /* Terminal View */
        <div className="p-6 max-w-6xl mx-auto">
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 min-h-[600px] flex flex-col">
            <div className="flex-1 overflow-auto mb-4">
              {terminalOutput.map((line, i) => (
                <div key={i} className={line.startsWith('$') ? 'text-green-400' : line.startsWith('Command') ? 'text-red-400' : 'text-gray-300'}>
                  {line}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">$</span>
              <input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCommand(command);
                    setCommand('');
                  }
                }}
                className="flex-1 bg-transparent outline-none text-green-400 caret-green-400"
                placeholder="Type a command..."
                autoFocus
              />
            </div>
          </div>

          {/* Command Suggestions */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.keys(commands).filter(cmd => cmd !== 'clear').map((cmd) => (
              <button
                key={cmd}
                onClick={() => { setCommand(cmd); handleCommand(cmd); setCommand(''); }}
                className="px-4 py-2 bg-gray-900 border border-gray-800 rounded hover:border-green-400 transition-colors text-left"
              >
                <span className="text-green-400">$</span> {cmd}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Visual View */
        <div className="p-6 max-w-6xl mx-auto">
          {/* Hero */}
          <div className="mb-12 p-8 bg-gray-900 rounded-lg border border-gray-800">
            <div className="flex items-center gap-2 mb-4 text-gray-500">
              <Folder className="w-4 h-4" />
              <span className="text-sm">~/portfolio</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">{data.personal.name}</h1>
            <div className="text-xl text-green-400 mb-4">&gt; {data.personal.title}</div>
            {data.personal.bio && (
              <p className="text-gray-400 max-w-2xl">{data.personal.bio}</p>
            )}
          </div>

          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <div className="mb-12 p-8 bg-gray-900 rounded-lg border border-gray-800">
              <div className="flex items-center gap-2 mb-6">
                <Code className="w-5 h-5 text-green-400" />
                <h2 className="text-2xl font-bold text-white">Skills</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {data.skills.map((skill, index) => (
                  <div key={index} className="px-4 py-2 bg-gray-950 border border-gray-800 rounded text-green-400 text-center">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <Terminal className="w-5 h-5 text-green-400" />
                <h2 className="text-2xl font-bold text-white">Projects</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {data.projects.map((project, index) => (
                  <div key={index} className="p-6 bg-gray-900 rounded-lg border border-gray-800 hover:border-green-400 transition-colors">
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-400 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-950 border border-gray-800 rounded text-xs text-green-400">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
                          Live Demo →
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
                          Source Code →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Experience</h2>
              <div className="space-y-6">
                {data.experience.map((exp, index) => (
                  <div key={index} className="p-6 bg-gray-900 rounded-lg border border-gray-800">
                    <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                    <div className="text-green-400 mt-1">{exp.company} • {exp.duration}</div>
                    <p className="text-gray-400 mt-3">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact */}
          <div className="p-8 bg-gray-900 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6">Get In Touch</h2>
            <div className="space-y-3">
              <div className="text-gray-400">
                <span className="text-green-400">Email:</span> {data.personal.email}
              </div>
              {data.social?.github && (
                <div className="text-gray-400">
                  <span className="text-green-400">GitHub:</span>{' '}
                  <a href={data.social.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {data.social.github}
                  </a>
                </div>
              )}
              {data.social?.linkedin && (
                <div className="text-gray-400">
                  <span className="text-green-400">LinkedIn:</span>{' '}
                  <a href={data.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {data.social.linkedin}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 text-center text-gray-500 text-sm mt-12">
        <p>© {new Date().getFullYear()} {data.personal.name} | Built with ❤️ and code</p>
      </footer>
    </div>
  );
}
