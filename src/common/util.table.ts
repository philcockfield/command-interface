import { log } from './libs';
import { compact } from './util';
const Table = require('cli-table');



export interface ITableOptions {
  head?: Array<string | undefined>;
  colWidths?: number[];
}

export interface ITable {
  add: (columns: Array<string | undefined>) => ITable;
  log: () => ITable;
  toString: () => string;
}


/**
 * Creates a new table builder.
 */
export function table(options?: ITableOptions): ITable {
  const { head = [], colWidths = [] } = options || {};
  const t = new Table({
    head: compact(head),
    colWidths,
  });
  const api = {
    /**
     * Adds a new row to the table.
     */
    add(columns: Array<string | undefined>) {
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
