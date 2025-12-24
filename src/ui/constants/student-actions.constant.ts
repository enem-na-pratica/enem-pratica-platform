export const STUDENT_ACTIONS = [
  { label: "Conteúdos", slug: "content", icon: "📚" },
  { label: "Pendências", slug: "to-be-reviewed", icon: "⏳" },
  { label: "Revisão", slug: "review", icon: "🔄" },
  { label: "Simulados", slug: "simulations", icon: "📝" },
  { label: "Redações", slug: "essays", icon: "✍️" },
];

export type StudentActionsType = (typeof STUDENT_ACTIONS)[number];