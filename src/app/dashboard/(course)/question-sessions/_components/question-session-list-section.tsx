import type { QuestionSessionWithTopicAndSubject } from '@/src/web/api';

import { QuestionSessionItem } from './_session/question-session-item';

export function QuestionSessionListSection({
  questionSessions,
}: {
  questionSessions: QuestionSessionWithTopicAndSubject[];
}) {
  return (
    <section className="grid grid-cols-1 gap-4">
      {questionSessions.length === 0 ? (
        <div className="py-20 text-center opacity-50">
          <p>Nenhuma sessão registrada ainda.</p>
        </div>
      ) : (
        questionSessions.map((session) => (
          <QuestionSessionItem
            key={session.id}
            session={session}
          />
        ))
      )}
    </section>
  );
}
