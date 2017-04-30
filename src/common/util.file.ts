import { Glob } from 'glob';
import { fs, fsPath, chokidar, Subject, jsYaml } from './libs';


/**
 * Matches the given glob pattern as a promise.
 */
export function glob(pattern: string): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    new Glob(pattern, {}, (err, matches) => { // tslint:disable-line
      if (err) {
        reject(err);
      } else {
        resolve(matches);
      }
    });
  });
}



/**
 * Walks up the folder tree looking for the given file.
 */
export async function findClosestAncestor(startDir: string, fileName: string) {
  const find = async (dir: string): Promise<string | undefined> => {
    if (!dir || dir === '/') { return; }
    const path = fsPath.join(dir, fileName);
    return (await fs.existsAsync(path))
      ? path
      : (await find(fsPath.resolve(dir, '..')));
  };
  return find(startDir);
}



/**
 * Watches the given file/folder pattern.
 */
export function watch(pattern: string) {
  const subject = new Subject<string>();
  chokidar
    .watch(pattern)
    .on('change', (path: string) => subject.next(path));
  return subject;
}



/**
 * Loads the given file and parses it as YAML.
 */
export async function yaml<T>(path: string) {
  try {
    const text = (await fs.readFileAsync(path)).toString();
    return jsYaml.safeLoad(text) as T;
  } catch (error) {
    throw new Error(`Failed to load YAML file '${path}'. ${error.message}`);
  }
}


