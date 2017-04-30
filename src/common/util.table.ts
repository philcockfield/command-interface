import { log } from './libs';
import { compact } from './util';
const Table = require('cli-table');





/**
 * Creates a new table builder.
 */
export function table(head: Array<string | undefined> = []) {
  head = compact(head);
  const t = new Table({ head });
  const api = {
    /**
     * Adds a new row to the table.
     */
    add(...columns: Array<string | undefined>) {
      t.push(columns.map((row) => row === undefined ? '' : row));
      return api;
    },

    /**
     * Converts the table to a string.
     */
    toString() { return t.toString(); },

    /**
     * Logs the table to the console.
     */
    log() { log.info(api.toString()); return api; },
  };
  return api;
}
