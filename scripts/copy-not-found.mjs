import { copyFile } from 'node:fs/promises';

const source = new URL('../dist/index.html', import.meta.url);
const destination = new URL('../dist/404.html', import.meta.url);

await copyFile(source, destination);
