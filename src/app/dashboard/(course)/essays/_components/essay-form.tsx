"use client";

import { useState } from "react";

import { useValidation } from "@/src/ui/hooks/use-validation";
import { ZodValidation } from "@/src/services/validation/zod/zod-validation";
import {
  newEssaySchema,
  NewEssaySchema,
} from "@/src/services/validation/zod/schemas/new-essay.schema";

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

// Mapeamento interno para converter as chaves do estado para as chaves do Schema
const schemaKeyMap: Record<CompetencyKey, keyof NewEssaySchema> = {
  c1: "competency1",
  c2: "competency2",
  c3: "competency3",
  c4: "competency4",
  c5: "competency5",
};

const essayValidator = new ZodValidation(newEssaySchema);

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

  const { errors, validate } = useValidation(essayValidator);

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

    // Transformamos o estado para o formato que o Zod Schema espera
    const dataToValidate = {
      theme: formData.theme,
      competency1: formData.scores.c1,
      competency2: formData.scores.c2,
      competency3: formData.scores.c3,
      competency4: formData.scores.c4,
      competency5: formData.scores.c5,
    };

    const isValid = validate(dataToValidate);

    if (isValid) {
      console.log("Dados validados e prontos para API:", dataToValidate);
      // Chame seu service aqui
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card border-2 border-(--accent) animate-in zoom-in-95 duration-300 overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-end">
        <div className="flex-1 w-full group">
          <label
            className={`text-sm font-bold mb-1 block transition-colors ${
              errors.theme ? "text-(--error)" : "opacity-70"
            }`}
          >
            Tema da Redação
          </label>
          <input
            type="text"
            required
            placeholder="Ex: Os estigmas associados..."
            className={`input transition-all ${
              errors.theme
                ? "border-(--error) ring-1 ring-(--error) animate-shake"
                : ""
            }`}
            minLength={20}
            maxLength={255}
            value={formData.theme}
            onChange={(e) => handleThemeChange(e.target.value)}
          />
          {/* Theme Error */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              errors.theme ? "max-h-10 mt-1" : "max-h-0"
            }`}
          >
            <p className="text-(--error) text-xs font-medium italic">
              {errors.theme?.[0]}
            </p>
          </div>
        </div>

        {/* Competency Grid */}
        <div className="flex flex-wrap sm:flex-nowrap items-end gap-4 w-full lg:w-auto">
          <div className="flex gap-2">
            {COMPETENCIES.map((key) => {
              const fieldError = errors[schemaKeyMap[key]];
              return (
                <div key={key} className="w-14 sm:w-16 relative">
                  <label
                    className={`text-[10px] font-bold mb-1 block uppercase text-center transition-colors ${
                      fieldError ? "text-(--error) opacity-100" : "opacity-60"
                    }`}
                  >
                    {key}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="200"
                    step="40"
                    required
                    className={`input text-center font-mono font-bold p-1 transition-all
                    ${
                      fieldError
                        ? "border-(--error) ring-1 ring-(--error) animate-shake text-(--error)"
                        : ""
                    }
                  `}
                    value={formData.scores[key]}
                    onChange={(e) => handleScoreChange(key, e.target.value)}
                  />
                  {/* Floating Error Indicator (Tooltip-like) */}
                  {fieldError && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-(--error) opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-(--error)"></span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          className="button-primary whitespace-nowrap h-[42px] w-full lg:w-auto active:scale-95 transition-transform"
        >
          Salvar
        </button>
      </div>

      {/* Global Error Message for Skills */}
      {COMPETENCIES.some((key) => errors[schemaKeyMap[key]]) && (
        <div className="mt-4 p-2 bg-(--error)/10 rounded-lg border border-(--error)/20 animate-in fade-in slide-in-from-top-1">
          <p className="text-(--error) text-[11px] text-center font-bold uppercase tracking-wider">
            As notas devem ser múltiplos de 40 (0, 40, 80, 120, 160, 200).
          </p>
        </div>
      )}
    </form>
  );
}
