export const STUDENT_MENU = [
  {
    title: "Conteúdos",
    slug: "content",
    icon: "📚",
    desc: "Material de estudo",
  },
  {
    title: "Para Revisar",
    slug: "to-be-reviewed",
    icon: "⏳",
    desc: "Tópicos pendentes",
  },
  {
    title: "Revisão",
    slug: "review",
    icon: "🔄",
    desc: "Praticar o que aprendeu",
  },
  {
    title: "Simulados",
    slug: "simulations",
    icon: "📝",
    desc: "Treine com o tempo",
  },
  {
    title: "Redações",
    slug: "essays",
    icon: "✍️",
    desc: "Pratique sua escrita",
  },
];

export type StudentMenuType = (typeof STUDENT_MENU)[number];