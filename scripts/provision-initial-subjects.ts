import { z } from 'zod';

/** * @description Raw data imported from data.json.
 * Please rename this variable to match your specific use case for better semantics.
 */
import rawData from './data.json';

const NonEmptyString = z.string().trim().min(1);

const SubjectSchema = z.object({
  name: NonEmptyString,
  topics: z.array(NonEmptyString).nonempty(),
});

type SubjectInput = z.infer<typeof SubjectSchema>;
