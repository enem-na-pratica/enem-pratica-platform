import { z } from 'zod';

const NonEmptyString = z.string().trim().min(1);

const SubjectSchema = z.object({
  name: NonEmptyString,
  topics: z.array(NonEmptyString).nonempty(),
});

type SubjectInput = z.infer<typeof SubjectSchema>;
