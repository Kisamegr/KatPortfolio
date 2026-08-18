import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';

const dist = resolve('dist');
const hrefPattern = /\b(?:href|src)=(?:"([^"]+)"|'([^']+)')/gi;
const basePath = process.env.GITHUB_ACTIONS === 'true' ? '/KatPortfolio' : '';

function filesIn(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? filesIn(path) : [path];
  });
}

function isInternal(reference) {
  return reference && !reference.startsWith('#') && !reference.startsWith('//') && !/^[a-z][a-z\d+.-]*:/i.test(reference);
}

function targetFor(reference, source) {
  const path = reference.split(/[?#]/, 1)[0];
  if (!path) return null;

  const target = path.startsWith('/')
    ? join(dist, path.replace(new RegExp(`^${basePath}/?`), '').replace(/^\/+/, ''))
    : resolve(join(source, '..'), path);
  const candidates = [target, `${target}.html`, join(target, 'index.html')];
  return candidates.find(existsSync) ?? null;
}

if (!existsSync(dist)) {
  throw new Error('Missing dist directory. Run the production build before checking links.');
}

const failures = [];
for (const htmlFile of filesIn(dist).filter((file) => file.endsWith('.html'))) {
  const html = readFileSync(htmlFile, 'utf8');
  for (const match of html.matchAll(hrefPattern)) {
    const reference = match[1] ?? match[2];
    if (isInternal(reference) && !targetFor(reference, htmlFile)) {
      failures.push(`${relative(dist, htmlFile).split(sep).join('/')}: ${reference}`);
    }
  }
}

if (failures.length) {
  console.error(`Broken internal links or assets (${failures.length}):\n${failures.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log('All generated internal links and assets resolve.');
}
