import { type ColumnData, TopicList } from './topic-list';

type PracticeColumnsProps = {
  practice: ColumnData;
  review: ColumnData;
};

export function PracticeColumns({ practice, review }: PracticeColumnsProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 grid grid-cols-1 gap-6 duration-500 sm:grid-cols-2">
      <Column
        title="Praticar"
        data={practice}
        dotColor="bg-yellow-500"
      />

      <Column
        title="Revisar"
        data={review}
        dotColor="bg-red-500"
      />
    </div>
  );
}

type TopicColumnProps = {
  title: string;
  data: ColumnData;
  dotColor: string; // Ex: 'bg-yellow-500', 'bg-red-500'
};

function Column({ title, data, dotColor }: TopicColumnProps) {
  return (
    <div className="card overflow-hidden border border-(--foreground)/10 p-0">
      <div className="flex items-center gap-2 border-b border-(--foreground)/10 px-4 py-3">
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotColor}`} />
        <h3 className="text-sm font-bold tracking-widest uppercase opacity-70">
          {title}
        </h3>
        <span className="ml-auto rounded-full bg-(--foreground)/5 px-2 py-0.5 font-mono text-xs opacity-40">
          {data.topics.length}
        </span>
      </div>
      <TopicList topics={data.topics} />
    </div>
  );
}
