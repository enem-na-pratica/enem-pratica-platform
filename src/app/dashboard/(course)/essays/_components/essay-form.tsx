"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEssaySchema, CreateEssayFormValues } from "@/src/web/validation";
import { createEssayAction } from "../actions";
import { CompetencyKey } from "@/src/web/api/modules";
import toast from "react-hot-toast";

const COMPETENCIES: CompetencyKey[] = ["c1", "c2", "c3", "c4", "c5"];

export function EssayForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateEssayFormValues>({
    resolver: zodResolver(createEssaySchema),
    mode: "onChange",
    defaultValues: {
      theme: "",
      grades: {
        c1: 120,
        c2: 120,
        c3: 120,
        c4: 120,
        c5: 120,
      },
    },
  });

  const onSubmit = async (data: CreateEssayFormValues) => {
    try {
      await createEssayAction(data);

      toast.success("Redação salva com sucesso!");

      reset({
        theme: "",
        grades: { c1: 120, c2: 120, c3: 120, c4: 120, c5: 120 },
      });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar redação.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card border-2 border-(--accent) animate-in zoom-in-95 duration-300 overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-end">
        {/* Theme field */}
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
            placeholder="Ex: Os estigmas associados..."
            className={`input transition-all ${
              errors.theme
                ? "border-(--error) ring-1 ring-(--error) animate-shake"
                : ""
            }`}
            {...register("theme")}
          />
          {/* Theme Error */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              errors.theme ? "max-h-10 mt-1" : "max-h-0"
            }`}
          >
            <p className="text-(--error) text-xs font-medium italic">
              {errors.theme?.message}
            </p>
          </div>
        </div>

        {/* Competency Grid */}
        <div className="flex flex-wrap sm:flex-nowrap items-end gap-4 w-full lg:w-auto">
          <div className="flex gap-2">
            {COMPETENCIES.map((key) => {
              const fieldError = errors.grades?.[key];

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
                    step="20"
                    className={`input text-center font-mono font-bold p-1 transition-all
                    ${
                      fieldError
                        ? "border-(--error) ring-1 ring-(--error) animate-shake text-(--error)"
                        : ""
                    }
                  `}
                    {...register(`grades.${key}`, { valueAsNumber: true })}
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
          disabled={!isValid || isSubmitting}
          className="button-primary whitespace-nowrap h-[42px] w-full lg:w-auto active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Salvando..." : "Salvar"}
        </button>
      </div>

      {/* Global Error Message for Skills */}
      {errors.grades && (
        <div className="mt-4 p-2 bg-(--error)/10 rounded-lg border border-(--error)/20 animate-in fade-in slide-in-from-top-1">
          <p className="text-(--error) text-[11px] text-center font-bold uppercase tracking-wider">
            As notas devem estar entre 0 e 200 e ser múltiplos de 20.
          </p>
        </div>
      )}
    </form>
  );
}
