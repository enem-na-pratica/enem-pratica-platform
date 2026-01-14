import { useState } from "react";

type CompetencyKey = "c1" | "c2" | "c3" | "c4" | "c5";

type EssayGrades = {
  c1: number;
  c2: number;
  c3: number;
  c4: number;
  c5: number;
  total: number;
};

type Essay = {
  id: string;
  authorId: string;
  theme: string;
  grades: EssayGrades;
  createdAt: Date;
};

type EssaySummary = {
  totalCount: number;
  globalAverage: number;
  averagesPerCompetency: Record<CompetencyKey, number>;
};

type EssaysResponse = {
  summary: EssaySummary;
  data: Essay[];
};

const COMPETENCIES: CompetencyKey[] = ["c1", "c2", "c3", "c4", "c5"];

export function EssayForm() {
  const [formData, setFormData] = useState({
    theme: "",
    scores: {
      c1: 120,
      c2: 120,
      c3: 120,
      c4: 120,
      c5: 120,
    },
  });

  const handleScoreChange = (key: CompetencyKey, value: string) => {
    setFormData((prev) => ({
      ...prev,
      scores: {
        ...prev.scores,
        [key]: Number(value),
      },
    }));
  };

  const handleThemeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, theme: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Dados prontos para API:", formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card border-2 border-(--accent) animate-in zoom-in-95 duration-300"
    >
      <div className="flex flex-col lg:flex-row gap-6 items-end">
        <div className="flex-1 w-full">
          <label className="text-sm font-bold opacity-70 mb-1 block">
            Tema da Redação
          </label>
          <input
            type="text"
            required
            placeholder="Ex: Os estigmas associados..."
            className="input"
            value={formData.theme}
            onChange={(e) => handleThemeChange(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-end gap-4 w-full lg:w-auto">
          <div className="flex gap-2">
            {COMPETENCIES.map((key) => (
              <div key={key} className="w-14 sm:w-16">
                <label className="text-[10px] font-bold opacity-60 mb-1 block uppercase text-center">
                  {key}
                </label>
                <input
                  type="number"
                  min="0"
                  max="200"
                  step="40"
                  required
                  className="input text-center font-mono font-bold p-1"
                  value={formData.scores[key]}
                  onChange={(e) => handleScoreChange(key, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="button-primary whitespace-nowrap h-[42px] w-full lg:w-auto"
        >
          Salvar
        </button>
      </div>
    </form>
  );
}
