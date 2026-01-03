export const USER_ACTIONS = [
  { label: "Conteúdos", slug: "content", icon: "📚" },
  { label: "A Revisar", slug: "to-be-reviewed", icon: "⏳" },
  { label: "Revisão", slug: "review", icon: "🔄" },
  { label: "Simulados", slug: "simulations", icon: "📝" },
  { label: "Redações", slug: "essays", icon: "✍️" },
];

export type UserActionType = (typeof USER_ACTIONS)[number];