const pluralize = require('pluralize');

/**
 * Creates a pluralised version of the given word.
 */
export function plural(singular?: string | null, total?: number) {
  return singular ? pluralize(singular, total) : singular;
}

/**
 * Creates a singularized version of the given word.
 */
export function singular(plural?: string | null) {
  return plural ? pluralize.singular(plural) : plural;
}
