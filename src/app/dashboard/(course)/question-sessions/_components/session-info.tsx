import type { QuestionSessionWithTopicAndSubject } from '@/src/web/api';

import { formatIsoToBrDate } from '../_utils';

type SessionInfoProps = {
  session: QuestionSessionWithTopicAndSubject;
};

export function SessionInfo({ session }: SessionInfoProps) {
  return (
    <div className="min-w-0 flex-1">
      <span className="font-mono text-[10px] tracking-tighter uppercase opacity-50">
        {formatIsoToBrDate(session.date)} · {session.topic.subject.name}
      </span>
      <h3
        className="truncate text-base font-bold"
        title={session.topic.title}
      >
        {session.topic.title}
      </h3>
      {session.nextReviewDate && (
        <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-(--error)/20 bg-(--error)/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-(--error) uppercase">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-(--error)" />
          Revisar em {formatIsoToBrDate(session.nextReviewDate)}
        </span>
      )}
    </div>
  );
}
