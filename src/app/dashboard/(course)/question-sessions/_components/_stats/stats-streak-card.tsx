type StatsStreakCardProps = {
  studyStreak: number;
};

export function StatsStreakCard({ studyStreak }: StatsStreakCardProps) {
  return (
    <div className="card flex flex-1 flex-col justify-center">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-xl">🔥</span>
        <h3 className="text-sm font-bold tracking-widest uppercase opacity-60">
          Sequência
        </h3>
      </div>
      <p className="text-3xl font-black">
        {studyStreak}
        <span className="ml-1 text-sm font-semibold opacity-50">dias</span>
      </p>
    </div>
  );
}
