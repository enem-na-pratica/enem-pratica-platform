import { EssayItem } from "./essay-item";
import { Essay } from "@/src/web/api";

export function EssayListSection({ essays }: { essays: Essay[] }) {
  return (
    <section className="grid grid-cols-1 gap-4">
      {essays.length === 0 ? (
        <div className="text-center py-20 opacity-50">
          <p>Nenhuma redação cadastrada ainda.</p>
        </div>
      ) : (
        essays.map((essay) => <EssayItem key={essay.id} essay={essay} />)
      )}
    </section>
  );
}
