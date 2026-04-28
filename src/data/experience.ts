export type Job = {
  company: string;
  role: string;
  range: string;
  location: string;
  summary: string;
};

export const EXPERIENCE: Job[] = [
  {
    company: 'Self-employed',
    role: 'Software Engineer (Freelance)',
    range: 'Oct 2025 — Present',
    location: 'Remote',
    summary:
      'Provide specialized full-stack engineering and consultation to four clients, building features in PHP, Laravel, and Vue.js. Drive product evolution end-to-end — from translating business requirements to resolving critical bugs in mission-critical applications.',
  },
  {
    company: 'Adeva',
    role: 'Senior Technical Lead',
    range: 'Aug 2021 — Aug 2025',
    location: 'Remote',
    summary:
      'Led a HealthTech initiative for clinical research, designing scalable Laravel/PostgreSQL APIs and HIPAA-aware data workflows. Implemented Auth0 SSO, refined microservices via GitHub Actions and Docker, and set engineering standards for testing and code review across distributed teams.',
  },
  {
    company: 'Modus Create',
    role: 'Senior Software Engineer / Team Lead',
    range: 'Oct 2016 — Aug 2021',
    location: 'Remote',
    summary:
      'Delivered scalable platforms in pharma and finance using PHP, Laravel, Vue.js, and MySQL — handling high-volume data ingestion from thousands of sites under regulatory compliance. Led Agile teams, built automated validation pipelines, and ran technical interviews for engineering hiring.',
  },
  {
    company: 'Fidelize',
    role: 'Senior Software Engineer',
    range: 'Feb 2015 — Oct 2016',
    location: 'Rio de Janeiro, Brazil',
    summary:
      'Optimized large-scale logistics software for pharmaceutical clients, redesigning architecture to support an 8× increase in data exchange capacity. Built an EDI integration tool connecting internal platforms to a global pharma logistics CRM.',
  },
  {
    company: 'Petaxxon Comunicação Online',
    role: 'Software Engineer',
    range: 'Aug 2012 — Jun 2014',
    location: 'Petrópolis, Brazil',
    summary:
      'Built and maintained the WebLetras platform and client sites with PHP, MySQL, and vanilla JS, focusing on usability, accessibility, and SEO. Strengthened full-stack and database skills through cross-functional collaboration.',
  },
  {
    company: 'Polaris Informática',
    role: 'Junior System Analyst',
    range: 'Jul 2009 — Sep 2009',
    location: 'Vitória, Brazil',
    summary:
      'Worked on enterprise authentication and IAM systems for Vale using Novell iChain, Access Manager, and Java — enabling SSO across mission-critical applications. Partnered with internal IT/security teams on integration and compliance.',
  },
  {
    company: 'Polaris Informática',
    role: 'Software Engineering Team Lead',
    range: 'Mar 2007 — Jun 2009',
    location: 'Vitória, Brazil',
    summary:
      'Led a cross-functional team delivering Java-based enterprise systems with Oracle and MS SQL Server, owning the full SDLC from requirements to deployment. Mentored developers and established Agile, code-review, and architecture standards.',
  },
  {
    company: 'LNCC',
    role: 'Software Engineer',
    range: 'Aug 2006 — Dec 2006',
    location: 'Petrópolis, Brazil',
    summary:
      'Built 3D craniofacial reconstruction software in C++/Qt/VTK for biomedical research, implementing image processing and mesh generation for prosthesis modeling. Collaborated with LNCC and USP São Carlos on CT-based reconstruction methods.',
  },
];
