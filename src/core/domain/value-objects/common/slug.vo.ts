import { ValueObject } from '@/src/core/domain/shared';

const SLUG_CONFIG = { MIN: 3, MAX: 50 };

export class Slug extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  /**
   * Validates if the string follows the slug pattern:
   * - Only lowercase letters, numbers, and hyphens.
   * - Does not start or end with a hyphen.
   * - Does not contain double hyphens.
   */
  protected validate(value: string): void {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

    if (!value && typeof value !== 'string') {
      throw new Error('The slug must be a string.');
    }

    if (value.length < SLUG_CONFIG.MIN || value.length > SLUG_CONFIG.MAX) {
      throw new Error(
        `The slug must be between ${SLUG_CONFIG.MIN} and ${SLUG_CONFIG.MAX} characters long.`,
      );
    }

    if (!slugRegex.test(value)) {
      throw new Error(
        `Invalid slug: "${value}". Slugs must contain only lowercase letters, numbers, and hyphens.`,
      );
    }
  }

  static slugify(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  static create(text: string): Slug {
    return new Slug(Slug.slugify(text));
  }
}
