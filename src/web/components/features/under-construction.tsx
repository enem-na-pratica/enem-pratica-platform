export function UnderConstruction({ title }: { title: string }) {
  return (
    <div className="card flex flex-col items-center justify-center h-64 border-2 border-dashed border-(--foreground)/10 bg-transparent text-(--foreground)/40">
      <span className="text-4xl mb-2">🚧</span>
      <p>Tela de {title} em construção...</p>
    </div>
  );
}
