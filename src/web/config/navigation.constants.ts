export const NAVIGATION_ITEMS = [
  {
    key: "content",
    label: "Conteúdos",
    icon: "📚",
    description: "Material de estudo",
  },
  {
    key: "to-be-reviewed",
    label: "Para Revisar",
    icon: "⏳",
    description: "Tópicos pendentes",
  },
  {
    key: "review",
    label: "Revisão",
    icon: "🔄",
    description: "Praticar o que aprendeu",
  },
  {
    key: "simulations",
    label: "Simulados",
    icon: "📝",
    description: "Treine com o tempo",
  },
  {
    key: "essays",
    label: "Redações",
    icon: "✍️",
    description: "Pratique sua escrita",
  },
] as const;

export type NavigationItem = (typeof NAVIGATION_ITEMS)[number];
export type NavigationKey = NavigationItem["key"];
