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
      'Operate as an independent consultant under G. P. Weinschütz Softwares M.E., partnering with clients to ship full-stack features in PHP, Laravel, and Vue.js. Engage end-to-end, from translating business needs into technical scope, to delivering features and resolving critical incidents in production systems.',
  },
  {
    company: 'Adeva',
    role: 'Senior Technical Lead',
    range: 'Aug 2021 — Aug 2025',
    location: 'Remote',
    summary:
      'Led the engineering of a HealthTech platform supporting clinical research, designing scalable Laravel/PostgreSQL APIs and HIPAA-aware data workflows handling sensitive patient and trial data across multiple tenants. Implemented Auth0 SSO, hardened GitLab CI/CD with Docker, and set engineering standards for testing and code review across distributed teams.',
  },
  {
    company: 'Modus Create',
    role: 'Senior Software Engineer / Team Lead',
    range: 'Oct 2016 — Aug 2021',
    location: 'Remote',
    summary:
      'Delivered platforms across pharma and finance over a five-year tenure using PHP, Laravel, Vue.js, and MySQL, supporting high-volume data ingestion from thousands of clinical sites under strict regulatory compliance. Grew from senior IC into a team lead role—running Agile delivery, building automated validation pipelines, and conducting technical interviews to shape the engineering bar.',
  },
  {
    company: 'Fidelize',
    role: 'Senior Software Engineer',
    range: 'Feb 2015 — Oct 2016',
    location: 'Rio de Janeiro, Brazil',
    summary:
      'Owned the redesign of a large-scale logistics platform serving pharmaceutical distributors, restructuring core architecture and data flows to support an 8x increase in data-exchange throughput without disrupting operations.',
  },
  {
    company: 'Petaxxon Comunicação Online',
    role: 'Software Engineer',
    range: 'Aug 2012 — Jun 2014',
    location: 'Petrópolis, Brazil',
    summary:
      'Maintained and evolved the WebLetras platform and client sites in PHP, MySQL, and vanilla JS, with a focus on usability, accessibility, and SEO. Built foundational full-stack and database expertise through close cross-functional collaboration with designers, editors, and clients.',
  },
  {
    company: 'Polaris Informática',
    role: 'Junior System Analyst',
    range: 'Jul 2009 — Sep 2009',
    location: 'Vitória, Brazil',
    summary:
      'Implemented enterprise authentication and IAM for Vale (one of the world\'s largest mining operators), using Novell iChain, Access Manager, and Java, enabling SSO across mission-critical applications. Partnered with internal IT and security teams on integration and compliance.',
  },
  {
    company: 'Polaris Informática',
    role: 'Software Engineering Team Lead',
    range: 'Mar 2007 — Jun 2009',
    location: 'Vitória, Brazil',
    summary:
      'Led a cross-functional team delivering Java-based enterprise systems on Oracle and MS SQL Server, owning the full SDLC from requirements to production deployment. Mentored developers and established Agile, code-review, and architecture standards that anchored the team\'s engineering practice.',
  },
  {
    company: 'LNCC',
    role: 'Software Engineer',
    range: 'Aug 2006 — Dec 2006',
    location: 'Petrópolis, Brazil',
    summary:
      'Developed 3D craniofacial reconstruction software in C++/Qt/VTK for biomedical research, implementing image processing and mesh generation pipelines used in prosthesis modeling. Collaborated with research teams from LNCC and USP São Carlos on CT-based reconstruction methods for clinical applications.',
  },
];