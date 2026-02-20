import { MockExam } from '@/src/web/api';

import { MockExamItem } from './simulado-item';

export function MockExamListSection({ mockExams }: { mockExams: MockExam[] }) {
  return (
    <section className="grid grid-cols-1 gap-8">
      {mockExams.length === 0 ? (
        <div className="py-20 text-center opacity-50">
          <p>Nenhum simulado cadastrado ainda.</p>
        </div>
      ) : (
        mockExams.map((mock) => (
          <MockExamItem
            key={mock.id}
            mock={mock}
          />
        ))
      )}
    </section>
  );
}
