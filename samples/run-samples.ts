import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const templates = [
    ['./parameterless.template.ts', {}],
    ['./with-parameters.template.ts', { lang: 'en', text: 'Hello, World!' }],
] as const;

await templates.forEach(async ([templatePath, templateData]) => {
    const template = await import(templatePath);
    const output = template.default(templateData);
    await fs.writeFile(path.join(__dirname, templatePath.replace('.template.ts', '.output.txt')), output);
});