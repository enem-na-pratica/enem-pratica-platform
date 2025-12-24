export const PERSONAL_MENU = [
  { title: "Conteúdos", slug: "content", icon: "📚" },
  { title: "Revisar", slug: "to-be-reviewed", icon: "⏳" },
  { title: "Revisão", slug: "review", icon: "🔄" },
  { title: "Simulados", slug: "simulations", icon: "📝" },
  { title: "Redações", slug: "essays", icon: "✍️" },
];

export type PersonalMenuType = (typeof PERSONAL_MENU)[number];