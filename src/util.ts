const write = (items) => {
  if (!log.silent) {
    console.log(items.join(' '));
  }
};

/**
 * Stub log shim.
 * Pipe these log items into a proper service log.
 */
export const log = {
  silent: false,
  info(...items) { write(items); },
  warn(...items) { write(items); },
  error(...items) { write(items); },
};
