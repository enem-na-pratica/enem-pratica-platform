type CapitalizeOptions = {
  /** Lista personalizada de palavras que devem permanecer em minúsculas */
  customLowercases?: string[];
  /** Se deve tentar identificar e manter Algarismos Romanos em maiúsculas */
  handleRomanNumerals?: boolean;
  /** Se deve manter palavras que já estão totalmente em maiúsculas (siglas) */
  preserveAcronyms?: boolean;
};

const DEFAULT_LOWERCASE_WORDS = new Set([
  // Artigos
  'o',
  'a',
  'os',
  'as',
  'um',
  'uma',
  'uns',
  'umas',

  // Preposições
  'de',
  'da',
  'do',
  'das',
  'dos',
  'em',
  'no',
  'na',
  'nos',
  'nas',
  'por',
  'para',
  'com',
  'sem',
  'sobre',
  'entre',

  // Conjunções
  'e',
  'ou',
  'mas',
  'nem',

  // Pronomes
  'me',
  'te',
  'se',
  'lhe',
  'lhes',
  'nos',
  'vos',

  // Contrações
  'à',
  'às',
  'ao',
  'aos',
  'pelo',
  'pela',
  'pelos',
  'pelas',
]);

const ROMAN_REGEX =
  /^(?=[MDCLXVI])M*(C[MD]|D?C{0,3})(X[CL]|L?X{0,3})(I[XV]|V?I{0,3})$/i;

/**
 * Formats a string to Title Case following Brazilian Portuguese (PT-BR) grammar rules.
 * * This function handles linguistic nuances such as:
 * - Automatically lowercasing specific articles, prepositions, and conjunctions.
 * - Protecting acronyms (e.g., "ABNT", "UNESCO").
 * - Identifying and formatting Roman numerals (e.g., "Dom Pedro II").
 * - Ensuring the first and last words are always capitalized regardless of grammar rules.
 * * @param {string} text - The raw string to be formatted.
 * @param {CapitalizeOptions} [options={}] - Configuration for tailoring the capitalization logic.
 * @returns {string} The formatted string, or an empty string if input is falsy.
 * * @example
 * capitalizePTBR("o senhor dos anéis");
 * // Returns "O Senhor dos Anéis"
 * * @example
 * capitalizePTBR("SECRETARIA DA FAZENDA - UNIDADE ii", { handleRomanNumerals: true });
 * // Returns "Secretaria da Fazenda - Unidade II"
 */
export function capitalizePTBR(
  text: string,
  options: CapitalizeOptions = {},
): string {
  if (!text) return '';

  const {
    customLowercases = [],
    handleRomanNumerals = true,
    preserveAcronyms = true,
  } = options;

  const lowercases = new Set([
    ...DEFAULT_LOWERCASE_WORDS,
    ...customLowercases.map((w) => w.toLowerCase()),
  ]);

  const words = text.trim().split(/\s+/);

  return words
    .map((word, index) =>
      formatWord({
        word,
        index,
        isLast: index === words.length - 1,
        lowercases,
        options: {
          preserveAcronyms,
          handleRomanNumerals,
        },
      }),
    )
    .join(' ');
}

function formatWord({
  word,
  index,
  isLast,
  lowercases,
  options,
}: {
  word: string;
  index: number;
  isLast: boolean;
  lowercases: Set<string>;
  options: CapitalizeOptions;
}): string {
  const specialCase = isSpecialCase({ word, options });
  if (specialCase) return specialCase;

  const lowerWord = word.toLowerCase();
  const isFirst = index === 0;

  // 3. Handle grammar-based lowercasing (excluding first and last words)
  if (!isFirst && !isLast && lowercases.has(lowerWord)) {
    return lowerWord;
  }

  // 4. Default: Title Case
  return lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
}

function isSpecialCase({
  word,
  options,
}: {
  word: string;
  options: CapitalizeOptions;
}): string | null {
  const { preserveAcronyms, handleRomanNumerals } = options;

  // 1. Handle Acronyms (e.g., "ABNT")
  if (preserveAcronyms && word === word.toUpperCase() && word.length > 1) {
    return word;
  }

  // 2. Handle Roman Numerals (e.g., "XXI")
  if (handleRomanNumerals && ROMAN_REGEX.test(word)) {
    return word.toUpperCase();
  }

  return null;
}
