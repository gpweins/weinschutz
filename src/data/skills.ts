export type SkillGroup = { name: string; chips: string[] };

export const SKILLS: SkillGroup[] = [
  { name: 'Backend', chips: ['PHP', 'Laravel', 'Node.js', 'REST APIs', 'Microservices', 'OOP'] },
  { name: 'Frontend', chips: ['Vue.js', 'React', 'JavaScript', 'TypeScript', 'HTML/CSS'] },
  { name: 'Data & Integrations', chips: ['PostgreSQL', 'MySQL', 'Database Optimization', 'Auth0 / SSO', 'EDI'] },
  { name: 'Cloud & DevOps', chips: ['AWS', 'Docker', 'GitHub Actions', 'CI/CD', 'Unit Testing', 'Git'] },
  { name: 'Leadership & Process', chips: ['Agile / Scrum', 'Team Leadership', 'Mentorship', 'Code Review', 'Technical Interviews'] },
];
