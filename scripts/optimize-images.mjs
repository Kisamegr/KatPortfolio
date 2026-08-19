import { readFile, readdir, stat, mkdir, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative } from "node:path";
import sharp from "sharp";

const root = process.cwd();
const sourceRoot = join(root, "public");
const masterRoot = join(root, "src", "assets", "masters");
const outputRoot = join(sourceRoot, "optimized");
const sourceFiles = [
  ...(await readdir(join(root, "src", "content", "projects")).then((files) =>
    files.map((file) => join(root, "src", "content", "projects", file)),
  )),
  join(root, "src", "pages", "index.astro"),
  join(root, "src", "pages", "about.astro"),
  join(root, "src", "content", "pages", "home.json"),
  join(root, "src", "content", "pages", "about.json"),
  join(root, "src", "content", "settings", "site.json"),
];
const sources = new Set();
for (const file of sourceFiles) {
  const text = await readFile(file, "utf8");
  for (const match of text.matchAll(
    /(?:\/portfolio-assets\/[^'"}\s]+|(?:about-photo|image(?:-02|-03)?|hero-background-blur)\.png|(?:about-photo-[\w-]+)\.jpg)/g,
  )) {
    const value = match[0];
    if (!/\.(?:png|jpe?g)$/i.test(value)) continue;
    sources.add(
      value.startsWith("/")
        ? value
        : `/portfolio-assets/figma-source/about/${value}`,
    );
  }
}
const staticSources = [
  "/portfolio-assets/home/flower-portrait-mono.png",
  "/portfolio-assets/home/flower-portrait-colour.png",
  "/portfolio-assets/figma-source/shared/img-0569.png",
  "/portfolio-assets/figma-source/work-index/img-0566.png",
  "/portfolio-assets/figma-source/shared/img-0368.png",
];
staticSources.forEach((source) => sources.add(source));
const widths = [640, 1280, 1920];
let originalBytes = 0;
let outputBytes = 0;
let generated = 0;
const dimensions = {};

for (const source of sources) {
  const publicInput = join(sourceRoot, source.slice(1));
  const masterInput = join(masterRoot, source.slice(1));
  let input = publicInput;
  try {
    let inputStat;
    try {
      inputStat = await stat(publicInput);
    } catch {
      input = masterInput;
      inputStat = await stat(masterInput);
    }
    const metadata = await sharp(input).metadata();
    if (metadata.width && metadata.height)
      dimensions[source] = { width: metadata.width, height: metadata.height };
    originalBytes += inputStat.size;
    const targetBase = join(
      outputRoot,
      source.slice(1).replace(new RegExp(`${extname(source)}$`, "i"), ""),
    );
    for (const width of widths) {
      for (const format of ['webp', 'avif']) {
        const output = `${targetBase}-${width}.${format}`;
        await mkdir(dirname(output), { recursive: true });
        const transformer = sharp(input, { animated: false }).resize({ width, withoutEnlargement: true });
        await (format === 'avif' ? transformer.avif({ quality: 55, effort: 5 }) : transformer.webp({ quality: 80, effort: 5 })).toFile(output);
        outputBytes += (await stat(output)).size;
        generated++;
      }
    }
  } catch (error) {
    console.warn(`Skipped ${relative(root, input)}: ${error.message}`);
  }
}
await writeFile(
  join(root, "src", "image-dimensions.json"),
  `${JSON.stringify(dimensions, null, 2)}\n`,
);
console.log(
  JSON.stringify(
    { sources: sources.size, generated, originalBytes, outputBytes },
    null,
    2,
  ),
);
