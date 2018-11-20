import { Glob } from 'glob';
import { fs, fsPath, chokidar, Subject, Observable, jsYaml } from './libs';

export interface IGlobOptions {
  nodir?: boolean;
  dot?: boolean;
  ignore?: string;
}

/**
 * Matches the given glob pattern as a promise.
 * See:
 *    https://www.npmjs.com/package/glob
 */
export function glob(
  pattern: string,
  options: IGlobOptions = {},
): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    new Glob(pattern, options, (err, matches) => {
      // tslint:disable-line
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
    if (!dir || dir === '/') {
      return;
    }
    const path = fsPath.join(dir, fileName);
    return (await fs.pathExists(path)) ? path : find(fsPath.resolve(dir, '..'));
  };
  return find(startDir);
}

/**
 * Watches the given file/folder pattern.
 */
export function watch(pattern: string): Observable<string> {
  const subject = new Subject<string>();
  chokidar.watch(pattern).on('change', (path: string) => subject.next(path));
  return subject.asObservable();
}

/**
 * Loads the given file and parses it as YAML.
 */
export async function yaml<T>(filePath: string) {
  // Support both .yml and .yaml file-extensions.
  let path = '';
  const subpath = filePath.substring(
    0,
    filePath.length - fsPath.extname(filePath).length,
  );
  const setIfExists = async (ext: string) => {
    if (path) {
      return;
    }
    const test = `${subpath}${ext}`;
    path = (await fs.pathExists(test)) ? test : path;
  };
  await setIfExists('.yml');
  await setIfExists('.yaml');

  // Attempt to load the YAML;
  try {
    const text = (await fs.readFile(path)).toString();
    const res = jsYaml.safeLoad(text) as any;
    return res as T;
  } catch (error) {
    throw new Error(`Failed to load YAML file '${filePath}'. ${error.message}`);
  }
}
