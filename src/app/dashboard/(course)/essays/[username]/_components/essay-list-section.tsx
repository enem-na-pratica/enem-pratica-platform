import { Essay } from '@/src/web/api';

import { EssayItem } from './essay-item';

export function EssayListSection({ essays }: { essays: Essay[] }) {
  return (
    <section className="grid grid-cols-1 gap-4">
      {essays.length === 0 ? (
        <div className="py-20 text-center opacity-50">
          <p>Nenhuma redação cadastrada ainda.</p>
        </div>
      ) : (
        essays.map((essay) => (
          <EssayItem
            key={essay.id}
            essay={essay}
          />
        ))
      )}
    </section>
  );
}
