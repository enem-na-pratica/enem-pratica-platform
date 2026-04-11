import { z } from 'zod';

import { Slug } from '@/src/core/domain/value-objects';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';

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

async function isSubjectAlreadyRegistered(slug: string): Promise<boolean> {
  const subject = await prisma.subject.findFirst({ where: { slug } });
  return !!subject;
}

async function createSubjectWithTopics(
  data: SubjectInput,
  slug: string,
): Promise<void> {
  const subject = await prisma.subject.create({
    data: {
      name: data.name,
      slug,
      topics: {
        create: data.topics.map((title, index) => ({
          title,
          position: index,
        })),
      },
    },
  });

  console.log(`✓ Subject criado: "${subject.name}"`);
}

async function ensureSubjectExists(data: SubjectInput): Promise<void> {
  const slug = Slug.slugify(data.name);

  if (await isSubjectAlreadyRegistered(slug)) {
    console.warn(`⚠️  Subject "${data.name}" já existe. Pulando...`);
    return;
  }

  await createSubjectWithTopics(data, slug);
}

function handleSeedError(error: unknown): void {
  if (error instanceof z.ZodError) {
    console.error(
      '❌ Erro de validação nos dados do JSON:',
      z.treeifyError(error),
    );
  } else {
    console.error('❌ Erro inesperado durante o seed:', error);
  }
  process.exit(1);
}
