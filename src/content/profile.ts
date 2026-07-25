import type {
  Credential,
  EducationEntry,
  ExperienceEntry,
  Localized,
  SkillGroup,
} from './types'

export const profile = {
  name: 'Gisella Gonzalez',
  handle: 'G.Kallisti',
  location: {
    en: 'Tandil, Argentina',
    es: 'Tandil, Argentina',
  } satisfies Localized,
  title: {
    en: 'AI Integration Specialist',
    es: 'Especialista en Integración de IA',
  } satisfies Localized,
  subtitle: {
    en: 'Agentic systems · LLM & Oracle integrations',
    es: 'Sistemas agénticos · Integraciones LLM y Oracle',
  } satisfies Localized,
  /* No age here on purpose: the previous site hardcoded "At 29 years old",
     which quietly went stale. */
  intro: {
    en: 'I build agentic AI systems end to end, on my own. At Accenture I took a conversational agent embedded in Oracle Transportation Management from a rudimentary, LLM-free assistant to a full agentic system — LLM reasoning, RAG, document recognition — in under a year, as the sole developer with no senior support.',
    es: 'Construyo sistemas de IA agéntica de punta a punta, sola. En Accenture llevé un agente conversacional embebido en Oracle Transportation Management desde un asistente rudimentario y sin LLM hasta un sistema agéntico completo — razonamiento LLM, RAG, reconocimiento de documentos — en menos de un año, como única desarrolladora y sin apoyo senior.',
  } satisfies Localized,
  introSecondary: {
    en: 'I work across the Oracle AI ecosystem and the modern LLM stack: agentic architecture, RAG pipelines and enterprise API integration. On the side I am studying video game development — which is where the arcade streak running through this page comes from.',
    es: 'Trabajo tanto en el ecosistema de IA de Oracle como en el stack moderno de LLMs: arquitectura agéntica, pipelines de RAG e integración de APIs enterprise. En paralelo estudio desarrollo de videojuegos — de ahí viene la veta arcade que recorre esta página.',
  } satisfies Localized,
  email: 'gg.kallisti@gmail.com',
  github: 'https://github.com/GKallisti',
  linkedin: 'https://linkedin.com/in/kallisti-gg',

  /* Drop a square-ish image at `public/gisella.jpg` and this renders in the
     About section. Left null until the file exists so the layout never shows
     a broken image. */
  photo: '/gisella.jpg' as string | null,
  photoAlt: {
    en: 'Gisella Gonzalez',
    es: 'Gisella Gonzalez',
  } satisfies Localized,
} as const

export const experience: ExperienceEntry[] = [
  {
    id: 'accenture',
    role: {
      en: 'Functional-Technical Consultant · AI Integration Engineer',
      es: 'Consultora Funcional-Técnica · Ingeniera de Integración de IA',
    },
    company: 'Accenture (Flo Group)',
    period: { en: '2024 — Present', es: '2024 — Presente' },
    summary: {
      en: 'Sole developer of a transactional conversational agent embedded in Oracle Transportation Management.',
      es: 'Única desarrolladora de un agente conversacional transaccional embebido en Oracle Transportation Management.',
    },
    highlights: {
      en: [
        'Architected and built an agentic assistant for OTM alone — architecture, code and documentation — with no senior supervision, taking it from an ODA-only, LLM-free assistant to a full agentic system with LLM reasoning, RAG and document recognition in under a year.',
        'Designed a schema-driven, declarative API catalog covering 13 OTM objects and 37 operations, on a modular deterministic pipeline: router → planner → entity resolver → executor → parser → presenter.',
        'Built it stateless for restart idempotency and horizontal scaling, with anti-hallucination guardrails on the RAG layer and a hybrid OCI / OpenAI LLM client.',
        'Presented live demos at multiple OTM industry conferences, and scoped a working demo for a prospective enterprise client facing recurring OTM planning failures.',
      ],
      es: [
        'Diseñé y construí sola un asistente agéntico para OTM — arquitectura, código y documentación — sin supervisión senior, llevándolo de un asistente basado solo en ODA y sin LLM a un sistema agéntico completo con razonamiento LLM, RAG y reconocimiento de documentos en menos de un año.',
        'Diseñé un catálogo de API declarativo y schema-driven que cubre 13 objetos de OTM y 37 operaciones, sobre un pipeline determinista y modular: router → planner → entity resolver → executor → parser → presenter.',
        'Lo construí stateless para lograr idempotencia ante reinicios y escalado horizontal, con guardrails anti-alucinación en la capa de RAG y un cliente LLM híbrido entre OCI y OpenAI.',
        'Presenté demos en vivo en varias conferencias de la industria OTM, y armé el alcance de una demo funcional para un cliente enterprise potencial con fallas recurrentes de planificación en OTM.',
      ],
    },
    stack: ['Agentic Architecture', 'RAG', 'OCI Generative AI', 'OpenAI', 'Oracle Digital Assistant', 'REST APIs'],
  },
  {
    id: 'freelance',
    role: {
      en: 'Freelance Web Developer — Self-employed',
      es: 'Desarrolladora Web Freelance — Independiente',
    },
    company: {
      en: 'Independent / Direct clients',
      es: 'Independiente / Clientes directos',
    },
    period: { en: 'Late 2022 — March 2024', es: 'Fines de 2022 — Marzo 2024' },
    summary: {
      en: 'E-commerce sites for small business clients, handled end to end.',
      es: 'Sitios de e-commerce para pequeños negocios, gestionados de punta a punta.',
    },
    highlights: {
      en: [
        'Designed, built and deployed WordPress e-commerce sites for small business clients, independently managing development, hosting and domain/DNS configuration.',
      ],
      es: [
        'Diseñé, construí y desplegué sitios de e-commerce en WordPress para pequeños negocios, gestionando de forma independiente el desarrollo, el hosting y la configuración de dominios y DNS.',
      ],
    },
    stack: ['WordPress', 'WooCommerce', 'MySQL', 'DNS', 'Hosting'],
  },
]

export const skillGroups: SkillGroup[] = [
  {
    id: 'ai',
    label: { en: 'AI & agentic systems', es: 'IA y sistemas agénticos' },
    items: [
      'LLM Integration',
      'Agentic Architecture',
      'RAG Pipelines',
      'Vector Databases (pgvector)',
      'Prompt Engineering & Guardrails',
      'LLMOps (OCI + OpenAI)',
      'Microsoft Semantic Kernel',
    ],
  },
  {
    id: 'oracle',
    label: { en: 'Oracle ecosystem', es: 'Ecosistema Oracle' },
    items: [
      'Oracle Digital Assistant',
      'OCI Generative AI',
      'Oracle Transportation Management',
      'Oracle Cloud Infrastructure',
    ],
  },
  {
    id: 'engineering',
    label: { en: 'Engineering', es: 'Ingeniería' },
    items: [
      'C# / .NET',
      'React / TypeScript',
      'Node.js',
      'JavaScript',
      'REST APIs',
      'Clean Architecture / CQRS',
      'PostgreSQL / PostGIS',
    ],
  },
  {
    id: 'platform',
    label: { en: 'Platform & delivery', es: 'Plataforma y despliegue' },
    items: [
      'Docker',
      'Git / GitHub Actions (CI/CD)',
      'DNS / Domain & Hosting Administration',
      'AI-Accelerated Development (Claude Code)',
      'WordPress',
    ],
  },
]

export const credentials: Credential[] = [
  {
    id: 'oracle-agent-studio',
    name: 'Oracle Fusion AI Agent Studio Certified Foundations Associate',
    issuer: 'Oracle',
    year: '2025',
  },
  {
    id: 'oracle-otm',
    name: 'Oracle Fusion Transportation and Global Trade Management Cloud 2024 Implementation Professional',
    issuer: 'Oracle',
    year: '2024',
  },
  {
    id: 'oci-ai-foundations',
    name: 'OCI AI Foundations Associate',
    issuer: 'Oracle',
    year: '2026',
    pending: true,
  },
  {
    id: 'efset',
    name: 'EF SET English Certificate — C2 Proficient',
    issuer: 'EF SET',
    year: '2024',
  },
]

export const education: EducationEntry[] = [
  {
    id: 'upso-gamedev',
    degree: {
      en: 'Technical Degree — Video Game Design & Development',
      es: 'Tecnicatura — Diseño y Desarrollo de Videojuegos',
    },
    institution: 'UPSO',
    period: { en: 'In progress', es: 'En curso' },
    inProgress: true,
  },
  {
    id: 'utn-web',
    degree: {
      en: 'Web Developer',
      es: 'Desarrolladora Web',
    },
    institution: 'UTN FRBA',
    period: { en: 'Completed', es: 'Completado' },
  },
]
