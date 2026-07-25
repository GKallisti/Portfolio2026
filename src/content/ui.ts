import type { Localized } from './types'

/** Interface copy. Content copy lives in `profile.ts` and `projects.ts`. */
export const ui = {
  nav: {
    home: { en: 'Home', es: 'Inicio' },
    work: { en: 'Work', es: 'Proyectos' },
    experience: { en: 'Experience', es: 'Experiencia' },
    skills: { en: 'Skills', es: 'Skills' },
    about: { en: 'About', es: 'Sobre mí' },
    contact: { en: 'Contact', es: 'Contacto' },
  },

  hero: {
    availability: {
      en: 'Open to AI engineering roles',
      es: 'Abierta a roles de ingeniería en IA',
    },
    scrollHint: { en: 'Scroll', es: 'Bajá' },
    tryAgent: {
      en: 'Or ask the assistant to show you around',
      es: 'O pedile al asistente que te guíe',
    },
  },

  sections: {
    workTitle: { en: 'Selected work', es: 'Trabajos seleccionados' },
    workLead: {
      en: 'Systems I designed and built, mostly on my own.',
      es: 'Sistemas que diseñé y construí, en su mayoría sola.',
    },
    experienceTitle: { en: 'Experience', es: 'Experiencia' },
    skillsTitle: { en: 'Skills', es: 'Skills' },
    aboutTitle: { en: 'About', es: 'Sobre mí' },
    credentialsTitle: { en: 'Certifications', es: 'Certificaciones' },
    educationTitle: { en: 'Education', es: 'Formación' },
    contactTitle: { en: 'Get in touch', es: 'Hablemos' },
    contactLead: {
      en: 'The fastest way to reach me is email. I read everything.',
      es: 'La forma más rápida de contactarme es por mail. Leo todo.',
    },
  },

  projects: {
    filtered: { en: 'Filtered', es: 'Filtrado' },
    showingAll: { en: 'Showing all projects', es: 'Mostrando todos los proyectos' },
    clearFilter: { en: 'Clear filter', es: 'Limpiar filtro' },
    noMatches: {
      en: 'No projects match that filter.',
      es: 'Ningún proyecto coincide con ese filtro.',
    },
    readMore: { en: 'Read more', es: 'Leer más' },
    readLess: { en: 'Read less', es: 'Leer menos' },
    visit: { en: 'Visit site', es: 'Ver sitio' },
    download: { en: 'Get the app', es: 'Descargar la app' },
    source: { en: 'Source', es: 'Código' },
    status: {
      production: { en: 'In production', es: 'En producción' },
      demonstrated: { en: 'Built & demonstrated', es: 'Construido y demostrado' },
      'in-progress': { en: 'In progress', es: 'En curso' },
      archived: { en: 'Archived', es: 'Archivado' },
    },
  },

  credentials: {
    inPreparation: { en: 'In preparation', es: 'En preparación' },
    inProgress: { en: 'In progress', es: 'En curso' },
  },

  agent: {
    label: { en: 'Assistant', es: 'Asistente' },
    open: { en: 'Open the assistant', es: 'Abrir el asistente' },
    close: { en: 'Close the assistant', es: 'Cerrar el asistente' },
    placeholder: {
      en: 'Ask me to change something…',
      es: 'Pedime que cambie algo…',
    },
    send: { en: 'Send', es: 'Enviar' },
    greeting: {
      en: "I can actually operate this page — filter the projects, switch language, change the theme, jump to a section. Try one of these, or just ask.",
      es: 'Puedo operar esta página de verdad — filtrar los proyectos, cambiar el idioma, cambiar el tema, saltar a una sección. Probá alguna de estas, o preguntame lo que quieras.',
    },
    suggestions: {
      en: [
        'Show me only the AI work',
        'Tell me about EnMoto',
        'Make it light and calmer',
        // The bait. Phrased as a question to her, not as "there is a secret",
        // so it reads like curiosity rather than a instruction manual.
        'What was that cheat code you could never remember?',
      ],
      es: [
        'Mostrame solo lo de IA',
        'Contame sobre EnMoto',
        'Ponelo claro y más tranquilo',
        '¿Cómo era ese truco de jueguitos que tanto te costó aprender?',
      ],
    },
    thinking: { en: 'Thinking', es: 'Pensando' },
    showPipeline: { en: 'Show pipeline', es: 'Ver pipeline' },
    hidePipeline: { en: 'Hide pipeline', es: 'Ocultar pipeline' },
    pipelineLabel: { en: 'Pipeline', es: 'Pipeline' },
    offline: {
      en: 'The model is unreachable right now, so I fell back to local commands. Those still work.',
      es: 'El modelo no está disponible ahora, así que pasé a comandos locales. Esos siguen funcionando.',
    },
    rateLimited: {
      en: 'That is a lot of questions in a short time — give it a minute. The commands below still work without the model.',
      es: 'Son muchas preguntas en poco tiempo — esperá un minuto. Los comandos de abajo siguen funcionando sin el modelo.',
    },
    error: {
      en: 'Something broke on my side. The local commands below still work.',
      es: 'Algo se rompió de mi lado. Los comandos locales de abajo siguen funcionando.',
    },
    actionApplied: { en: 'Applied', es: 'Aplicado' },
  },

  controls: {
    theme: { en: 'Toggle theme', es: 'Cambiar tema' },
    language: { en: 'Switch language', es: 'Cambiar idioma' },
    effects: { en: 'Toggle retro effects', es: 'Activar/desactivar efectos retro' },
    menu: { en: 'Menu', es: 'Menú' },
  },

  footer: {
    /* The stack already appears in the project card for this site; repeating
       it down here was noise. */
    builtWith: {
      en: 'Made with ❤️ and a few extra tokens — 2026',
      es: 'Hecho con ❤️ y algunos tokens extra — 2026',
    },
  },
} as const satisfies Record<string, unknown>

export type UICopy = typeof ui
export type { Localized }
