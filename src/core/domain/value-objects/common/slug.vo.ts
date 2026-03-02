import { ValueObject } from '@/src/core/domain/shared';

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

    if (!value || value.trim().length === 0) {
      throw new Error('Slug cannot be empty.');
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
